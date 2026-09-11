using LifeOrganizer.Application.Finances.Commands.Budget;
using System.Net.Http.Json;
using System.Net;

namespace LifeOrganizer.Tests.Integration.Tests.DataIsolation
{
    public class BudgetDataIsolationTests : IntegrationTestBase
    {
        public BudgetDataIsolationTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task GetAllBudgets_ShouldNotReturnAnotherUsersBudgets()
        {
            var categoryResponse = await Client.PostAsJsonAsync("/api/v1/transactioncategories", new { Name = "Food", Type = 0 });
            var categoryId = await categoryResponse.Content.ReadFromJsonAsync<Guid>();

            var createResponse = await Client.PostAsJsonAsync("/api/v1/budgets", new
            {
                Id = Guid.NewGuid(),
                CategoryId = categoryId,
                MonthlyLimit = 7777,
            });
            Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);

            TestAuthHandler.CurrentUserId = Guid.NewGuid();

            var listResponse = await Client.GetAsync("/api/v1/budgets");
            var budgets = await listResponse.Content.ReadFromJsonAsync<List<BudgetDto>>();

            Assert.DoesNotContain(budgets!, b => b.MonthlyLimit == 7777);
        }
    }
}
