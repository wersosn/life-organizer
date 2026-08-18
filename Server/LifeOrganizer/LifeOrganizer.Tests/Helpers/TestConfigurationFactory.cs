using Microsoft.Extensions.Configuration;

namespace LifeOrganizer.Tests.Helpers
{
    public static class TestConfigurationFactory
    {
        public static IConfiguration Create(Dictionary<string, string> values)
        {
            return new ConfigurationBuilder()
                .AddInMemoryCollection(values!)
                .Build();
        }
    }
}
