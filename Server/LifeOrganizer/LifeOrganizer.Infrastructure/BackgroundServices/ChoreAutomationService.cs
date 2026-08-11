using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Common.Settings;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LifeOrganizer.Infrastructure.BackgroundServices
{
    public class ChoreAutomationService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<ChoreAutomationService> _logger;
        private readonly AutomationSettings _settings;

        public ChoreAutomationService(IServiceScopeFactory scopeFactory, ILogger<ChoreAutomationService> logger, IOptions<AutomationSettings> settings)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
            _settings = settings.Value;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("ChoreAutomationService started. Interval: {interval} minutes.", _settings.ChoreCheckIntervalMinutes);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CheckChoresAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "ChoreAutomationService check failed.");
                }
                await Task.Delay(TimeSpan.FromMinutes(_settings.ChoreCheckIntervalMinutes), stoppingToken);
            }
        }

        private async Task CheckChoresAsync(CancellationToken cancellationToken)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

            var chores = await context.Chores
                .Where(c => c.IsActive && c.IsAutomationEnabled && c.User.ChoreAutomationEnabled)
                .ToListAsync(cancellationToken);

            if (chores.Count == 0)
            {
                _logger.LogInformation("Chore automation check found no active chores with automation enabled.");
                return;
            }

            var now = DateTime.UtcNow;
            var tasksCreated = 0;

            foreach (var chore in chores)
            {
                var isOverdue = ChoreOverdueCalculator.IsOverdue(chore.LastCompletedAt, chore.FrequencyUnit, chore.FrequencyValue, now);
                if (!isOverdue)
                {
                    continue;
                }

                // do not create a second task on the same day for the same chore
                var taskAlreadyExists = await context.TodoItems.AnyAsync(t =>
                    t.Source == TaskSource.ChoreAutomation &&
                    t.SourceId == chore.Id &&
                    !t.IsCompleted,
                    cancellationToken);

                if (taskAlreadyExists)
                {
                    continue;
                }

                context.TodoItems.Add(new TodoItem
                {
                    Id = Guid.NewGuid(),
                    UserId = chore.UserId,
                    Title = chore.Name,
                    Source = TaskSource.ChoreAutomation,
                    SourceId = chore.Id,
                    CreatedAt = now,
                    IsCompleted = false,
                });
                tasksCreated++;
            }

            if (tasksCreated > 0)
            {
                await context.SaveChangesAsync(cancellationToken);
                _logger.LogInformation("Chore automation created {count} new tasks from overdue chores.", tasksCreated);
            }
        }
    }
}
