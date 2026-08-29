using LifeOrganizer.Application.Common.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Concurrent;

namespace LifeOrganizer.Infrastructure.Caching
{
    public class MemoryCacheService : ICacheService
    {
        private readonly IMemoryCache _cache;
        private readonly ConcurrentDictionary<string, byte> _trackedKeys = new();

        public MemoryCacheService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public async Task<T> GetOrCreateAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null)
        {
            if (_cache.TryGetValue(key, out T? cached))
            {
                return cached!;
            }

            var value = await factory();
            var options = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromMinutes(5)
            };
            options.RegisterPostEvictionCallback((evictedKey, _, _, _) => _trackedKeys.TryRemove(evictedKey.ToString()!, out _));

            _cache.Set(key, value, options);
            _trackedKeys.TryAdd(key, 0);
            return value;
        }

        public void Remove(string key)
        {
            _cache.Remove(key);
            _trackedKeys.TryRemove(key, out _);
        }

        public void RemoveByPrefix(string prefix)
        {
            var matching = _trackedKeys.Keys.Where(k => k.StartsWith(prefix, StringComparison.Ordinal)).ToList();
            foreach (var key in matching)
            {
                Remove(key);
            }
        }
    }
}
