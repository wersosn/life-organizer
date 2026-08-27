using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http.Json;

namespace LifeOrganizer.Tests.Integration.Tests
{
    public class IdempotencyTests : IntegrationTestBase
    {
        public IdempotencyTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task DuplicateRequest_WithSameIdempotencyKey_ShouldReturnCachedResponse_NotCreateDuplicate()
        {
            var idempotencyKey = Guid.NewGuid().ToString();
            var command = new { Name = "Test Category", Type = 0 };

            Client.DefaultRequestHeaders.Add("Idempotency-Key", idempotencyKey);

            var firstResponse = await Client.PostAsJsonAsync("/api/transactioncategories", command);
            var firstId = await firstResponse.Content.ReadFromJsonAsync<Guid>();

            var secondResponse = await Client.PostAsJsonAsync("/api/transactioncategories", command);
            var secondId = await secondResponse.Content.ReadFromJsonAsync<Guid>();
            Assert.Equal(firstId, secondId);

            using var scope = Factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var categoryCount = await context.TransactionCategories.CountAsync(c => c.Name == "Test Category");

            Assert.Equal(1, categoryCount);

            Client.DefaultRequestHeaders.Remove("Idempotency-Key");
        }

        [Fact]
        public async Task DifferentIdempotencyKeys_ShouldCreateSeparateRecords()
        {
            var command = new { Name = "Another Category", Type = 0 };

            Client.DefaultRequestHeaders.Add("Idempotency-Key", Guid.NewGuid().ToString());
            var firstResponse = await Client.PostAsJsonAsync("/api/transactioncategories", command);
            Client.DefaultRequestHeaders.Remove("Idempotency-Key");

            Client.DefaultRequestHeaders.Add("Idempotency-Key", Guid.NewGuid().ToString());
            var secondResponse = await Client.PostAsJsonAsync("/api/transactioncategories", command);
            Client.DefaultRequestHeaders.Remove("Idempotency-Key");

            var firstId = await firstResponse.Content.ReadFromJsonAsync<Guid>();
            var secondId = await secondResponse.Content.ReadFromJsonAsync<Guid>();

            Assert.NotEqual(firstId, secondId);
        }

        [Fact]
        public async Task RequestWithoutIdempotencyKey_ShouldAlwaysCreateNewRecord()
        {
            var command = new { Name = "No Key Category", Type = 0 };

            var firstResponse = await Client.PostAsJsonAsync("/api/transactioncategories", command);
            var secondResponse = await Client.PostAsJsonAsync("/api/transactioncategories", command);

            var firstId = await firstResponse.Content.ReadFromJsonAsync<Guid>();
            var secondId = await secondResponse.Content.ReadFromJsonAsync<Guid>();

            Assert.NotEqual(firstId, secondId);
        }
    }
}
