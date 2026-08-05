using LifeOrganizer.Application.Habits.Commands;
using LifeOrganizer.Application.Habits.Commands.CreateHabit;
using LifeOrganizer.Application.Habits.Commands.GetHabitById;
using LifeOrganizer.Domain.Enums;
using System.Net.Http.Json;

namespace LifeOrganizer.Tests.Integration.Tests
{
    public class HabitFlowTests : IntegrationTestBase
    {
        public HabitFlowTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task FullHabitFlow_CreateCompleteAndFetch_ShouldReflectCompletionInDetails()
        {
            // Create
            var createCommand = new CreateHabitCommand("Meditation", HabitFrequency.Daily, new List<DayOfWeek>(), null);

            var createResponse = await Client.PostAsJsonAsync("/api/habits", createCommand);
            createResponse.EnsureSuccessStatusCode();
            var habitId = await createResponse.Content.ReadFromJsonAsync<Guid>();

            var listResponse = await Client.GetAsync("/api/habits");
            listResponse.EnsureSuccessStatusCode();
            var habits = await listResponse.Content.ReadFromJsonAsync<List<HabitDto>>();

            var created = Assert.Single(habits!, h => h.Id == habitId);
            Assert.False(created.IsCompletedToday);

            var completeResponse = await Client.PatchAsync($"/api/habits/{habitId}/complete", null);
            completeResponse.EnsureSuccessStatusCode();

            var detailsResponse = await Client.GetAsync($"/api/habits/{habitId}");
            detailsResponse.EnsureSuccessStatusCode();
            var details = await detailsResponse.Content.ReadFromJsonAsync<HabitDetailsDto>();

            Assert.Single(details!.RecentCompletions, c => c.Status == HabitCompletionStatus.Completed);
        }
    }
}
