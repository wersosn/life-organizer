using LifeOrganizer.Infrastructure.Caching;
using Microsoft.Extensions.Caching.Memory;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Caching
{
    public class MemoryCacheServiceTests
    {
        private static MemoryCacheService CreateService() => new(new MemoryCache(new MemoryCacheOptions()));
        
        private readonly ITestOutputHelper output;
        public MemoryCacheServiceTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetOrCreateAsync_ShouldCallFactoryOnlyOnce_WhenCalledTwiceWithSameKey()
        {
            var service = CreateService();
            var callCount = 0;

            async Task<int> Factory()
            {
                callCount++;
                return await Task.FromResult(42);
            }

            var first = await service.GetOrCreateAsync("key1", Factory);
            var second = await service.GetOrCreateAsync("key1", Factory);

            Assert.Equal(42, first);
            Assert.Equal(42, second);
            Assert.Equal(1, callCount);

            output.WriteLine($"Factory called {callCount} time(s) for two GetOrCreateAsync calls with the same key - cache hit confirmed");
        }

        [Fact]
        public async Task GetOrCreateAsync_ShouldCallFactoryAgain_ForDifferentKeys()
        {
            var service = CreateService();
            var callCount = 0;

            Task<int> Factory() 
            { 
                callCount++; 
                return Task.FromResult(callCount); 
            }

            await service.GetOrCreateAsync("key1", Factory);
            await service.GetOrCreateAsync("key2", Factory);

            Assert.Equal(2, callCount);

            output.WriteLine($"Factory called {callCount} time(s) for two different keys - no incorrect cache sharing between keys");
        }

        [Fact]
        public async Task Remove_ShouldForceFactoryToRunAgain()
        {
            var service = CreateService();
            var callCount = 0;

            Task<int> Factory() 
            { 
                callCount++;
                return Task.FromResult(callCount); 
            }

            await service.GetOrCreateAsync("key1", Factory);
            service.Remove("key1");
            await service.GetOrCreateAsync("key1", Factory);

            Assert.Equal(2, callCount);

            output.WriteLine($"Factory called {callCount} time(s) after explicit Remove - cache invalidation confirmed");
        }

        [Fact]
        public async Task RemoveByPrefix_ShouldRemoveOnlyMatchingKeys()
        {
            var service = CreateService();

            await service.GetOrCreateAsync("user:1:summary:2026-07", () => Task.FromResult("a"));
            await service.GetOrCreateAsync("user:1:budgets-usage:2026-07", () => Task.FromResult("b"));
            await service.GetOrCreateAsync("user:2:summary:2026-07", () => Task.FromResult("c"));

            service.RemoveByPrefix("user:1:");

            var user1CallCount = 0;
            await service.GetOrCreateAsync("user:1:summary:2026-07", () => { user1CallCount++; return Task.FromResult("a"); });

            var user2CallCount = 0;
            await service.GetOrCreateAsync("user:2:summary:2026-07", () => { user2CallCount++; return Task.FromResult("c"); });

            Assert.Equal(1, user1CallCount);
            Assert.Equal(0, user2CallCount);

            output.WriteLine("RemoveByPrefix(\"user:1:\") evicted user1's cached keys but left user2's untouched - prefix scoping confirmed");
        }
    }
}
