using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Common.Settings;
using LifeOrganizer.Application.Interfaces;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Infrastructure.BackgroundServices;
using LifeOrganizer.Infrastructure.Email;
using LifeOrganizer.Infrastructure.Notifications;
using LifeOrganizer.Infrastructure.Persistence;
using LifeOrganizer.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LifeOrganizer.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHttpContextAccessor();
            services.AddDbContext<AppDbContext>(options => options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
            
            services.AddScoped<IApplicationDbContext, AppDbContext>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddScoped<ICurrentUserService, CurrentUserService>();

            services.Configure<AutomationSettings>(configuration.GetSection("Automation"));
            services.AddHostedService<HabitAutomationService>();
            services.AddHostedService<ChoreAutomationService>();
            services.AddHostedService<TaskHistoryCleanupService>();

            services.AddHttpClient<PushNotificationSender>();

            services.Configure<EmailSettings>(configuration.GetSection("Email"));
            services.AddScoped<IEmailSender, MailtrapEmailSender>();

            return services;
        }
    }
}
