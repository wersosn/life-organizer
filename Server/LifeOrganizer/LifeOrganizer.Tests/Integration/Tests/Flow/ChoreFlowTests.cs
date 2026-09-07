using LifeOrganizer.Application.Chores.Commands.Chore.GetChoreById;
using LifeOrganizer.Application.Chores.Commands.Chore;
using System.Net.Http.Json;
using System.Net;

namespace LifeOrganizer.Tests.Integration.Tests.Flow
{
    public class ChoreFlowTests : IntegrationTestBase
    {
        public ChoreFlowTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        private async Task<Guid> CreateCategoryAsync(string name = "Kitchen")
        {
            var response = await Client.PostAsJsonAsync("/api/v1/chorecategories", new { Name = name });
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<Guid>();
        }

        [Fact]
        public async Task FullFlow_CreateUpdateCompleteDelete_ShouldWorkEndToEnd()
        {
            // Create:
            var categoryId = await CreateCategoryAsync();
            var createResponse = await Client.PostAsJsonAsync("/api/v1/chores", new
            {
                Id = Guid.NewGuid(),
                Name = "Wash dishes",
                CategoryId = categoryId,
                FrequencyUnit = 0, 
                FrequencyValue = 1,
            });
            Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
            var choreId = await createResponse.Content.ReadFromJsonAsync<Guid>();

            // Show chores:
            var listResponse = await Client.GetAsync("/api/v1/chores");
            var chores = await listResponse.Content.ReadFromJsonAsync<List<ChoreDto>>();
            Assert.Contains(chores!, c => c.Id == choreId);

            // Show chore details:
            var getByIdResponse = await Client.GetAsync($"/api/v1/chores/{choreId}");
            Assert.Equal(HttpStatusCode.OK, getByIdResponse.StatusCode);
            var details = await getByIdResponse.Content.ReadFromJsonAsync<ChoreDetailsDto>();
            Assert.Equal("Wash dishes", details!.Name);

            // Complete chore:
            var completeResponse = await Client.PatchAsJsonAsync($"/api/v1/chores/{choreId}/complete", new { });
            Assert.Equal(HttpStatusCode.OK, completeResponse.StatusCode);

            var afterCompleteResponse = await Client.GetAsync($"/api/v1/chores/{choreId}");
            var afterComplete = await afterCompleteResponse.Content.ReadFromJsonAsync<ChoreDetailsDto>();
            Assert.NotNull(afterComplete!.LastCompletedAt);
            Assert.False(afterComplete.IsOverdue);

            // Update chore:
            var updateResponse = await Client.PutAsJsonAsync($"/api/v1/chores/{choreId}", new
            {
                Name = "Wash dishes thoroughly",
                CategoryId = categoryId,
                FrequencyUnit = 0,
                FrequencyValue = 2,
                IsAutomationEnabled = true,
            });
            Assert.Equal(HttpStatusCode.NoContent, updateResponse.StatusCode);

            // Delete chore:
            var deleteResponse = await Client.DeleteAsync($"/api/v1/chores/{choreId}");
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

            var afterDeleteResponse = await Client.GetAsync("/api/v1/chores");
            var choresAfterDelete = await afterDeleteResponse.Content.ReadFromJsonAsync<List<ChoreDto>>();
            Assert.DoesNotContain(choresAfterDelete!, c => c.Id == choreId);
        }
    }
}
