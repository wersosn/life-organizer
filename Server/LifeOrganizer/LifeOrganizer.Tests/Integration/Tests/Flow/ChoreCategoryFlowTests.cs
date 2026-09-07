using LifeOrganizer.Application.Chores.Commands.ChoreCategories;
using System.Net.Http.Json;
using System.Net;

namespace LifeOrganizer.Tests.Integration.Tests.Flow
{
    public class ChoreCategoryFlowTests : IntegrationTestBase
    {
        public ChoreCategoryFlowTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task FullFlow_CreateUpdateDelete_ShouldWorkEndToEnd()
        {
            // Create:
            var createResponse = await Client.PostAsJsonAsync("/api/v1/chorecategories", new { Name = "Bathroom" });
            Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
            var categoryId = await createResponse.Content.ReadFromJsonAsync<Guid>();

            // Show chore categories:
            var listResponse = await Client.GetAsync("/api/v1/chorecategories");
            var categories = await listResponse.Content.ReadFromJsonAsync<List<ChoreCategoryDto>>();
            Assert.Contains(categories!, c => c.Id == categoryId && c.Name == "Bathroom");

            // Update:
            var updateResponse = await Client.PutAsJsonAsync($"/api/v1/chorecategories/{categoryId}", new { Name = "Bathroom & Laundry" });
            Assert.Equal(HttpStatusCode.NoContent, updateResponse.StatusCode);

            // Delete:
            var deleteResponse = await Client.DeleteAsync($"/api/v1/chorecategories/{categoryId}");
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
        }
    }
}
