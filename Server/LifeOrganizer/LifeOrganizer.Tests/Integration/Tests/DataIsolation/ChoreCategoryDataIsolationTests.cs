using LifeOrganizer.Application.Chores.Commands.ChoreCategories;
using System.Net.Http.Json;
using System.Net;

namespace LifeOrganizer.Tests.Integration.Tests.DataIsolation
{
    public class ChoreCategoryDataIsolationTests : IntegrationTestBase
    {
        public ChoreCategoryDataIsolationTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task GetAllCategories_ShouldNotReturnAnotherUsersCategories()
        {
            var createResponse = await Client.PostAsJsonAsync("/api/v1/chorecategories", new
            {
                Name = "Private Chore Category",
            });
            Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);

            TestAuthHandler.CurrentUserId = Guid.NewGuid();

            var listResponse = await Client.GetAsync("/api/v1/chorecategories");
            var categories = await listResponse.Content.ReadFromJsonAsync<List<ChoreCategoryDto>>();

            Assert.DoesNotContain(categories!, c => c.Name == "Private Chore Category");
        }
    }
}
