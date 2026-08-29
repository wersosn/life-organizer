using LifeOrganizer.Application.Common.Interfaces;

namespace LifeOrganizer.Tests.Helpers
{
    public class FakeCacheService : ICacheService
    {
        public async Task<T> GetOrCreateAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null)
        {
            return await factory();
        }
        public void Remove(string key) { }
        public void RemoveByPrefix(string prefix) { }
    }
}
