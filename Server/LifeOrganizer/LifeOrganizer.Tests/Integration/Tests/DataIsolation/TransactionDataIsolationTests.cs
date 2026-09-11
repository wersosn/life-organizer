using LifeOrganizer.Application.Finances.Commands.Transactions;
using System.Net.Http.Json;
using System.Net;

namespace LifeOrganizer.Tests.Integration.Tests.DataIsolation
{
    public class TransactionDataIsolationTests : IntegrationTestBase
    {
        public TransactionDataIsolationTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task GetAllTransactions_ShouldNotReturnAnotherUsersTransactions()
        {
            var categoryResponse = await Client.PostAsJsonAsync("/api/v1/transactioncategories", new { Name = "Food", Type = 0 });
            var categoryId = await categoryResponse.Content.ReadFromJsonAsync<Guid>();

            var createResponse = await Client.PostAsJsonAsync("/api/v1/transactions", new
            {
                Id = Guid.NewGuid(),
                CategoryId = categoryId,
                Amount = 999,
                Type = 0,
                Date = DateOnly.FromDateTime(DateTime.UtcNow),
                Description = "Private Transaction",
            });
            Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);

            TestAuthHandler.CurrentUserId = Guid.NewGuid();

            var listResponse = await Client.GetAsync("/api/v1/transactions");
            var transactions = await listResponse.Content.ReadFromJsonAsync<List<TransactionDto>>();

            Assert.DoesNotContain(transactions!, t => t.Description == "Private Transaction");
        }
    }
}
