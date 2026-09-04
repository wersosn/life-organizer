using System.Net.Http.Json;
using System.Net;

namespace LifeOrganizer.Tests.Integration.Tests.Setup
{
    public class AuthSetupTests : IntegrationTestBase
    {
        public AuthSetupTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task AuthenticatedEndpoint_ShouldReturnSuccessOrNotFound_NotUnauthorized()
        {
            var response = await Client.GetAsync("/api/v1/habits");

            Assert.NotEqual(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task CurrentUserId_ShouldBeReflectedInCreatedResource()
        {
            var createCommand = new
            {
                Name = "Diagnostic habit",
                Frequency = 0,
                ScheduledDays = new int[] { },
                CompletionDeadline = (string?)null
            };

            var response = await Client.PostAsJsonAsync("/api/v1/habits", createCommand);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var habitId = await response.Content.ReadFromJsonAsync<Guid>();
            Assert.NotEqual(Guid.Empty, habitId);
        }
    }
}
