using LifeOrganizer.Application.Finances.Commands.Transactions.GetMonthlySummary;
using System.Net.Http.Json;

namespace LifeOrganizer.Tests.Integration.Tests.Cache
{
    public class MonthlySummaryCachingTests : IntegrationTestBase
    {
        public MonthlySummaryCachingTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task MonthlySummary_ShouldReflectNewTransaction_AfterCacheInvalidation()
        {
            var categoryResponse = await Client.PostAsJsonAsync("/api/v1/transactioncategories", new { Name = "Cache Test", Type = 0 });
            var categoryId = await categoryResponse.Content.ReadFromJsonAsync<Guid>();

            var year = DateTime.UtcNow.Year;
            var month = DateTime.UtcNow.Month;

            var beforeResponse = await Client.GetAsync($"/api/v1/transactions/summary?year={year}&month={month}");
            var before = await beforeResponse.Content.ReadFromJsonAsync<MonthlySummaryDto>();
            var expenseBefore = before!.TotalExpense;

            await Client.PostAsJsonAsync("/api/v1/transactions", new
            {
                CategoryId = categoryId,
                Amount = 250,
                Type = 0,
                Date = DateOnly.FromDateTime(DateTime.UtcNow),
            });

            var afterResponse = await Client.GetAsync($"/api/v1/transactions/summary?year={year}&month={month}");
            var after = await afterResponse.Content.ReadFromJsonAsync<MonthlySummaryDto>();

            Assert.Equal(expenseBefore + 250, after!.TotalExpense);
        }
    }
}
