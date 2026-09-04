using LifeOrganizer.Infrastructure.BackgroundServices;
using LifeOrganizer.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http.Json;
using System.Net;
using Microsoft.EntityFrameworkCore;
using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Tests.Integration.Tests.Automation
{
    public class HabitAutomationEndToEndTests : IntegrationTestBase
    {
        public HabitAutomationEndToEndTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task RunHabitCheck_ShouldCreateTaskInDatabase_ForOverdueHabit()
        {
            var createResponse = await Client.PostAsJsonAsync("/api/v1/habits", new
            {
                Id = Guid.NewGuid(),
                Name = "Integration Test Habit",
                Frequency = 0, // Daily
                ScheduledDays = Array.Empty<int>(),
                CompletionDeadline = "00:01:00",
                IsAutomationEnabled = true,
            });
            Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
            var habitId = await createResponse.Content.ReadFromJsonAsync<Guid>();

            using var scope = Factory.Services.CreateScope();
            var automationService = scope.ServiceProvider.GetRequiredService<HabitAutomationService>();
            await automationService.RunCheckOnceAsync();

            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var task = await context.TodoItems.FirstOrDefaultAsync(t => t.Source == TaskSource.HabitAutomation && t.SourceId == habitId);

            Assert.NotNull(task);
            Assert.Equal("Integration Test Habit", task!.Title);
        }

        [Fact]
        public async Task RunHabitCheck_ShouldNotDuplicateTask_WhenRunTwiceInSameDay()
        {
            var createResponse = await Client.PostAsJsonAsync("/api/v1/habits", new
            {
                Id = Guid.NewGuid(),
                Name = "Duplicate Check Habit",
                Frequency = 0,
                ScheduledDays = Array.Empty<int>(),
                CompletionDeadline = "00:01:00",
                IsAutomationEnabled = true,
            });
            var habitId = await createResponse.Content.ReadFromJsonAsync<Guid>();

            using var scope = Factory.Services.CreateScope();
            var automationService = scope.ServiceProvider.GetRequiredService<HabitAutomationService>();

            await automationService.RunCheckOnceAsync();
            await automationService.RunCheckOnceAsync();

            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var taskCount = await context.TodoItems.CountAsync(t =>t.Source == TaskSource.HabitAutomation && t.SourceId == habitId);

            Assert.Equal(1, taskCount);
        }
    }
}
