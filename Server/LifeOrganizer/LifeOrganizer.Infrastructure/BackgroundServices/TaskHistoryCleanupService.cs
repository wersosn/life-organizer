using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Common.Settings;
using LifeOrganizer.Domain.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LifeOrganizer.Infrastructure.BackgroundServices
{
    public class TaskHistoryCleanupService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<TaskHistoryCleanupService> _logger;
        private readonly AutomationSettings _settings;
        public TaskHistoryCleanupService(IServiceScopeFactory scopeFactory, ILogger<TaskHistoryCleanupService> logger, IOptions<AutomationSettings> settings)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
            _settings = settings.Value;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("TaskHistoryCleanupService started. Interval: {interval} minutes.", _settings.CleanupCheckIntervalMinutes);
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CleanupAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "TaskHistoryCleanupService check failed.");
                }
                await Task.Delay(TimeSpan.FromMinutes(_settings.CleanupCheckIntervalMinutes), stoppingToken);
            }
        }

        private async Task CleanupAsync(CancellationToken cancellationToken)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

            var now = DateTime.UtcNow;

            var retentionByUser = await context.Users
                .Select(u => new { u.Id, u.TaskHistoryRetentionDays })
                .ToDictionaryAsync(u => u.Id, u => u.TaskHistoryRetentionDays, cancellationToken);

            var completedTasks = await context.TodoItems
                .Where(t => t.IsCompleted && t.CompletedAt != null)
                .ToListAsync(cancellationToken);

            var tasksToDelete = completedTasks
                .Where(t => TaskRetentionCalculator.ShouldDelete(t, retentionByUser.GetValueOrDefault(t.UserId, 30), now))
                .ToList();

            if (tasksToDelete.Count == 0)
            {
                _logger.LogInformation("Task history cleanup found nothing to remove.");
                return;
            }
            context.TodoItems.RemoveRange(tasksToDelete);
            await context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Task history cleanup removed {count} completed tasks past their retention period.", tasksToDelete.Count);
        }
    }
}
