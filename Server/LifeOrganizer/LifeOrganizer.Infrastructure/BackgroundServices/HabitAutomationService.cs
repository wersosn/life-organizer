using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Common.Settings;
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

            var activeCount = await context.Habits.CountAsync(h => h.IsActive && h.IsAutomationEnabled, cancellationToken);

            _logger.LogInformation("Habit automation check completed at {time}. Active habits with automation: {count}", DateTime.UtcNow, activeCount);
        }
    }
}
