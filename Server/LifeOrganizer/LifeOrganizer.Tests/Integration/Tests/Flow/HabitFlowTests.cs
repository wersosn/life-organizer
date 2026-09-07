using LifeOrganizer.Application.Chores.Commands.Chore;
using LifeOrganizer.Application.Habits.Commands;
using LifeOrganizer.Application.Habits.Commands.CreateHabit;
using LifeOrganizer.Application.Habits.Commands.GetHabitById;
using LifeOrganizer.Application.Todo.Commands;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using System.Net;
using System.Net.Http.Json;

namespace LifeOrganizer.Tests.Integration.Tests.Flow
{
    public class HabitFlowTests : IntegrationTestBase
    {
        public HabitFlowTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task FullHabitFlow_CreateCompleteAndFetch_ShouldReflectCompletionInDetails()
        {
            // Create:
            var createCommand = new CreateHabitCommand(Guid.NewGuid(), "Meditation", HabitFrequency.Daily, new List<DayOfWeek>(), null);

            var createResponse = await Client.PostAsJsonAsync("/api/v1/habits", createCommand);
            createResponse.EnsureSuccessStatusCode();
            var habitId = await createResponse.Content.ReadFromJsonAsync<Guid>();

            var listResponse = await Client.GetAsync("/api/v1/habits");
            listResponse.EnsureSuccessStatusCode();
            var habits = await listResponse.Content.ReadFromJsonAsync<List<HabitDto>>();

            var created = Assert.Single(habits!, h => h.Id == habitId);
            Assert.False(created.IsCompletedToday);

            // Complete:
            var completeResponse = await Client.PatchAsync($"/api/v1/habits/{habitId}/complete", null);
            completeResponse.EnsureSuccessStatusCode();

            // Show details:
            var detailsResponse = await Client.GetAsync($"/api/v1/habits/{habitId}");
            detailsResponse.EnsureSuccessStatusCode();
            var details = await detailsResponse.Content.ReadFromJsonAsync<HabitDetailsDto>();

            Assert.Single(details!.RecentCompletions, c => c.Status == HabitCompletionStatus.Completed);

            // Delete:
            var deleteResponse = await Client.DeleteAsync($"/api/v1/habits/{habitId}");
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

            // Show habits after deleting a habit:
            var afterDeleteResponse = await Client.GetAsync("/api/v1/habits");
            var habitsAfterDelete = await afterDeleteResponse.Content.ReadFromJsonAsync<List<HabitDto>>();
            Assert.DoesNotContain(habitsAfterDelete!, c => c.Id == habitId);
        }
    }
}
