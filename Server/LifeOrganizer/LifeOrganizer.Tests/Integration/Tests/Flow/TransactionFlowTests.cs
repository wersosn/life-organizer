using LifeOrganizer.Application.Finances.Commands.Transactions.GetMonthlySummary;
using LifeOrganizer.Application.Finances.Commands.Transactions;
using System.Net.Http.Json;
using System.Net;

namespace LifeOrganizer.Tests.Integration.Tests.Flow
{
    public class TransactionFlowTests : IntegrationTestBase
    {
        public TransactionFlowTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        private async Task<Guid> CreateCategoryAsync(string name = "Food", int type = 0)
        {
            var response = await Client.PostAsJsonAsync("/api/v1/transactioncategories", new { Name = name, Type = type });
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<Guid>();
        }

        [Fact]
        public async Task FullFlow_CreateUpdateDelete_ShouldWorkEndToEnd()
        {
            // Create:
            var categoryId = await CreateCategoryAsync();
            var createResponse = await Client.PostAsJsonAsync("/api/v1/transactions", new
            {
                Id = Guid.NewGuid(),
                CategoryId = categoryId,
                Amount = 49.99,
                Type = 0,
                Date = DateOnly.FromDateTime(DateTime.UtcNow),
                Description = "Groceries"
            });
            Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
            var transactionId = await createResponse.Content.ReadFromJsonAsync<Guid>();

            // Show transaction:
            var getByIdResponse = await Client.GetAsync($"/api/v1/transactions/{transactionId}");
            Assert.Equal(HttpStatusCode.OK, getByIdResponse.StatusCode);
            var transaction = await getByIdResponse.Content.ReadFromJsonAsync<TransactionDto>();
            Assert.Equal(49.99m, transaction!.Amount);

            // Update:
            var updateResponse = await Client.PutAsJsonAsync($"/api/v1/transactions/{transactionId}", new
            {
                CategoryId = categoryId,
                Amount = 75.00,
                Type = 0,
                Date = DateOnly.FromDateTime(DateTime.UtcNow),
                Description = "Groceries and snacks"
            });
            Assert.Equal(HttpStatusCode.NoContent, updateResponse.StatusCode);

            // Show monthly summary:
            var summaryResponse = await Client.GetAsync($"/api/v1/transactions/summary?year={DateTime.UtcNow.Year}&month={DateTime.UtcNow.Month}");
            Assert.Equal(HttpStatusCode.OK, summaryResponse.StatusCode);
            var summary = await summaryResponse.Content.ReadFromJsonAsync<MonthlySummaryDto>();
            Assert.Equal(75.00m, summary!.TotalExpense);

            // Delete:
            var deleteResponse = await Client.DeleteAsync($"/api/v1/transactions/{transactionId}");
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

            var afterDeleteResponse = await Client.GetAsync($"/api/v1/transactions/summary?year={DateTime.UtcNow.Year}&month={DateTime.UtcNow.Month}");
            var summaryAfterDelete = await afterDeleteResponse.Content.ReadFromJsonAsync<MonthlySummaryDto>();
            Assert.Equal(0, summaryAfterDelete!.TotalExpense);
        }
    }
}
