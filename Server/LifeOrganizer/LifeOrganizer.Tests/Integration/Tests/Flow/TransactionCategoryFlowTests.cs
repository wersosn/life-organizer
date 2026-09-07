using LifeOrganizer.Application.Finances.Commands.TransactionCategories;
using System.Net.Http.Json;
using System.Net;

namespace LifeOrganizer.Tests.Integration.Tests.Flow
{
    public class TransactionCategoryFlowTests : IntegrationTestBase
    {
        public TransactionCategoryFlowTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task FullFlow_CreateUpdateDelete_ShouldWorkEndToEnd()
        {
            // Create:
            var createResponse = await Client.PostAsJsonAsync("/api/v1/transactioncategories", new { Name = "Transport", Type = 0 });
            Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
            var categoryId = await createResponse.Content.ReadFromJsonAsync<Guid>();

            // Show categories:
            var listResponse = await Client.GetAsync("/api/v1/transactioncategories");
            var categories = await listResponse.Content.ReadFromJsonAsync<List<TransactionCategoryDto>>();
            Assert.Contains(categories!, c => c.Id == categoryId && c.Name == "Transport");

            // Update:
            var updateResponse = await Client.PutAsJsonAsync($"/api/v1/transactioncategories/{categoryId}", new
            {
                Name = "Public Transport",
                Type = 0,
            });
            Assert.Equal(HttpStatusCode.NoContent, updateResponse.StatusCode);

            // Delete:
            var deleteResponse = await Client.DeleteAsync($"/api/v1/transactioncategories/{categoryId}");
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
        }
    }
}
