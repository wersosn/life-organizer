using LifeOrganizer.Application.Habits.Commands;
using System.Net.Http.Json;
using System.Net;

namespace LifeOrganizer.Tests.Integration.Tests.DataIsolation
{
    public class HabitDataIsolationTests : IntegrationTestBase
    {
        public HabitDataIsolationTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task GetAllHabits_ShouldNotReturnAnotherUsersHabits()
        {
            var createResponse = await Client.PostAsJsonAsync("/api/v1/habits", new
            {
                Id = Guid.NewGuid(),
                Name = "Private Habit",
                Frequency = 0,
                ScheduledDays = Array.Empty<int>(),
                IsAutomationEnabled = true,
            });
            Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);

            TestAuthHandler.CurrentUserId = Guid.NewGuid();

            var listResponse = await Client.GetAsync("/api/v1/habits");
            var habits = await listResponse.Content.ReadFromJsonAsync<List<HabitDto>>();

            Assert.DoesNotContain(habits!, h => h.Name == "Private Habit");
        }
    }
}
