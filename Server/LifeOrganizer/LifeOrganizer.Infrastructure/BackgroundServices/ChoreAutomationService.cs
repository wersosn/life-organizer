using LifeOrganizer.Application.Common.Events;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Common.Settings;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Domain.Services;
using MediatR;
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
            var publisher = scope.ServiceProvider.GetRequiredService<IPublisher>();

            var chores = await context.Chores
                .Include(c => c.User)
                .Where(c => c.IsActive && c.IsAutomationEnabled && c.User.ChoreAutomationEnabled)
                .ToListAsync(cancellationToken);

            if (chores.Count == 0)
            {
                _logger.LogInformation("Chore automation check found no active chores with automation enabled.");
                return;
            }

            var now = DateTime.UtcNow;

            var eventsPublished = 0;
            foreach (var chore in chores)
            {
                if (!ChoreOverdueCalculator.IsOverdue(chore.LastCompletedAt, chore.FrequencyUnit, chore.FrequencyValue, now))
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

                await publisher.Publish(new ChoreOverdueEvent(chore.Id, chore.UserId, chore.Name), cancellationToken);
                eventsPublished++;
            }

            if (eventsPublished > 0)
            {
                _logger.LogInformation("Chore automation published {count} ChoreOverdueEvent(s).", eventsPublished);
            }
        }

        // For tests:
        public Task RunCheckOnceAsync(CancellationToken cancellationToken = default) => CheckChoresAsync(cancellationToken);
    }
}
