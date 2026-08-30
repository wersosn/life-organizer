using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace LifeOrganizer.Tests.Helpers
{
    public static class TestScopeFactory
    {
        public static IServiceScopeFactory Create(IApplicationDbContext context, IPublisher publisher)
        {
            var services = new ServiceCollection();
            services.AddSingleton(context);
            services.AddSingleton(publisher);

            var provider = services.BuildServiceProvider();
            return provider.GetRequiredService<IServiceScopeFactory>();
        }
    }
}
