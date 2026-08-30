using Microsoft.Extensions.Options;

namespace LifeOrganizer.Tests.Helpers
{
    public static class TestOptionsFactory
    {
        public static IOptions<T> Create<T>(T value) where T : class => Options.Create(value);
    }
}
