using LifeOrganizer.Application.Finances.Commands.Budget.GetBudgetWithUsage;
using System.Net.Http.Json;
using System.Net;

namespace LifeOrganizer.Tests.Integration.Tests.Flow
{
    public class BudgetFlowTests : IntegrationTestBase
    {
        public BudgetFlowTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        private async Task<Guid> CreateCategoryAsync(string name = "Food", int type = 0)
        {
            var response = await Client.PostAsJsonAsync("/api/v1/transactioncategories", new { Name = name, Type = type });
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<Guid>();
        }

        [Fact]
        public async Task FullFlow_CreateUpdateUsageDelete_ShouldWorkEndToEnd()
        {
            // Create:
            var categoryId = await CreateCategoryAsync();
            var createResponse = await Client.PostAsJsonAsync("/api/v1/budgets", new
            {
                Id = Guid.NewGuid(),
                CategoryId = categoryId,
                MonthlyLimit = 500,
            });
            Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
            var budgetId = await createResponse.Content.ReadFromJsonAsync<Guid>();

            await Client.PostAsJsonAsync("/api/v1/transactions", new
            {
                Id = Guid.NewGuid(),
                CategoryId = categoryId,
                Amount = 150,
                Type = 0,
                Date = DateOnly.FromDateTime(DateTime.UtcNow),
            });

            // Show usage:
            var usageResponse = await Client.GetAsync($"/api/v1/budgets/usage?year={DateTime.UtcNow.Year}&month={DateTime.UtcNow.Month}");
            Assert.Equal(HttpStatusCode.OK, usageResponse.StatusCode);
            var usage = await usageResponse.Content.ReadFromJsonAsync<List<BudgetUsageDto>>();
            var budgetUsage = usage!.First(b => b.Id == budgetId);
            Assert.Equal(150, budgetUsage.Spent);
            Assert.False(budgetUsage.IsExceeded);

            // Update:
            var updateResponse = await Client.PutAsJsonAsync($"/api/v1/budgets/{budgetId}", new { MonthlyLimit = 100 });
            Assert.Equal(HttpStatusCode.NoContent, updateResponse.StatusCode);

            // Show usage after update:
            var usageAfterUpdateResponse = await Client.GetAsync($"/api/v1/budgets/usage?year={DateTime.UtcNow.Year}&month={DateTime.UtcNow.Month}");
            var usageAfterUpdate = await usageAfterUpdateResponse.Content.ReadFromJsonAsync<List<BudgetUsageDto>>();
            var budgetUsageAfterUpdate = usageAfterUpdate!.First(b => b.Id == budgetId);
            Assert.True(budgetUsageAfterUpdate.IsExceeded); // 150 spent > 100 limit 

            // Delete:
            var deleteResponse = await Client.DeleteAsync($"/api/v1/budgets/{budgetId}");
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
        }
    }
}
