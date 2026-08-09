using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Common.Settings;
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

            var activeCount = await context.Chores.CountAsync(h => h.IsActive && h.IsAutomationEnabled, cancellationToken);

            _logger.LogInformation("Chore automation check completed at {time}. Active Chores with automation: {count}", DateTime.UtcNow, activeCount);
        }
    }
}
