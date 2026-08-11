using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Common.Settings;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Domain.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LifeOrganizer.Infrastructure.BackgroundServices
{
    public class HabitAutomationService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<HabitAutomationService> _logger;
        private readonly AutomationSettings _settings;

        public HabitAutomationService(IServiceScopeFactory scopeFactory, ILogger<HabitAutomationService> logger, IOptions<AutomationSettings> settings)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
            _settings = settings.Value;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("HabitAutomationService started. Interval: {interval} minutes.", _settings.HabitCheckIntervalMinutes);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CheckHabitsAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "HabitAutomationService check failed.");
                }
                await Task.Delay(TimeSpan.FromMinutes(_settings.HabitCheckIntervalMinutes), stoppingToken);
            }
        }

        private async Task CheckHabitsAsync(CancellationToken cancellationToken)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>(); 

            var habits = await context.Habits
                .Where(h => h.IsActive && h.IsAutomationEnabled && h.User.HabitAutomationEnabled)
                .ToListAsync(cancellationToken);

            if (habits.Count == 0)
            {
                _logger.LogInformation("Habit automation check found no active habits with automation enabled.");
                return;
            }

            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var now = DateTime.UtcNow;
            var habitIds = habits.Select(h => h.Id).ToList();

            var todaysCompletions = await context.HabitCompletions
                .Where(c => habitIds.Contains(c.HabitId) && c.Date == today)
                .ToDictionaryAsync(c => c.HabitId, c => (HabitCompletionStatus?)c.Status, cancellationToken);

            var tasksCreated = 0;
            foreach (var habit in habits)
            {
                todaysCompletions.TryGetValue(habit.Id, out var existingStatus);

                // if habit has not been marked for today, mark it as Missed
                if (!todaysCompletions.ContainsKey(habit.Id))
                {
                    context.HabitCompletions.Add(new HabitCompletion
                    {
                        Id = Guid.NewGuid(),
                        HabitId = habit.Id,
                        Date = today,
                        Status = HabitCompletionStatus.Missed,
                        CompletedAt = null,
                    });
                }

                // do not create a second task on the same day for the same habit
                var taskAlreadyExists = await context.TodoItems.AnyAsync(t =>
                    t.Source == TaskSource.HabitAutomation &&
                    t.SourceId == habit.Id &&
                    t.CreatedAt.Date == now.Date,
                    cancellationToken);

                if (!HabitTaskDecider.ShouldCreateTask(habit, today, now, existingStatus, taskAlreadyExists))
                {
                    continue;
                }

                context.TodoItems.Add(new TodoItem
                {
                    Id = Guid.NewGuid(),
                    UserId = habit.UserId,
                    Title = habit.Name,
                    Source = TaskSource.HabitAutomation,
                    SourceId = habit.Id,
                    CreatedAt = now,
                    IsCompleted = false,
                });
                tasksCreated++;
            }

            if (tasksCreated > 0)
            {
                await context.SaveChangesAsync(cancellationToken);
                _logger.LogInformation("Habit automation created {count} new tasks from missed habits.", tasksCreated);
            }
        }
    }
}
