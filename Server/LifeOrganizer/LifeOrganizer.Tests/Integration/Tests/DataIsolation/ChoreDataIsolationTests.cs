using LifeOrganizer.Application.Chores.Commands.Chore;
using System.Net.Http.Json;
using System.Net;

namespace LifeOrganizer.Tests.Integration.Tests.DataIsolation
{
    public class ChoreDataIsolationTests : IntegrationTestBase
    {
        public ChoreDataIsolationTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task GetAllChores_ShouldNotReturnAnotherUsersChores()
        {
            var categoryResponse = await Client.PostAsJsonAsync("/api/v1/chorecategories", new { Name = "Kitchen" });
            var categoryId = await categoryResponse.Content.ReadFromJsonAsync<Guid>();

            var createResponse = await Client.PostAsJsonAsync("/api/v1/chores", new
            {
                Id = Guid.NewGuid(),
                Name = "Private Chore",
                CategoryId = categoryId,
                FrequencyUnit = 0,
                FrequencyValue = 1,
            });
            Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);

            TestAuthHandler.CurrentUserId = Guid.NewGuid();

            var listResponse = await Client.GetAsync("/api/v1/chores");
            var chores = await listResponse.Content.ReadFromJsonAsync<List<ChoreDto>>();

            Assert.DoesNotContain(chores!, c => c.Name == "Private Chore");
        }
    }
}
