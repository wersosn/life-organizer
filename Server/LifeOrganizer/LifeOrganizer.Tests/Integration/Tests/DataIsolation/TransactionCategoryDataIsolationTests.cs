using LifeOrganizer.Application.Finances.Commands.TransactionCategories;
using System.Net.Http.Json;
using System.Net;

namespace LifeOrganizer.Tests.Integration.Tests.DataIsolation
{
    public class TransactionCategoryDataIsolationTests : IntegrationTestBase
    {
        public TransactionCategoryDataIsolationTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task GetAllCategories_ShouldNotReturnAnotherUsersCategories()
        {
            var createResponse = await Client.PostAsJsonAsync("/api/v1/transactioncategories", new
            {
                Name = "Private Transaction Category",
                Type = 0,
            });
            Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);

            TestAuthHandler.CurrentUserId = Guid.NewGuid();

            var listResponse = await Client.GetAsync("/api/v1/transactioncategories");
            var categories = await listResponse.Content.ReadFromJsonAsync<List<TransactionCategoryDto>>();

            Assert.DoesNotContain(categories!, c => c.Name == "Private Transaction Category");
        }
    }
}
