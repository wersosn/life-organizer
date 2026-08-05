using LifeOrganizer.Application.Habits.Commands.GetHabitById;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Habits
{
    public class GetHabitByIdTests
    {
        private readonly ITestOutputHelper output;
        public GetHabitByIdTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetHabitById_ShouldReturnHabitWithRecentCompletions()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var habit = new Habit
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Meditation",
                Frequency = Domain.Enums.HabitFrequency.Daily,
                IsActive = true
            };
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            context.Habits.Add(habit);
            context.HabitCompletions.AddRange(
                new HabitCompletion
                {
                    Id = Guid.NewGuid(),
                    HabitId = habit.Id,
                    Date = today,
                    Status = HabitCompletionStatus.Completed,
                    CompletedAt = DateTime.UtcNow
                },
                new HabitCompletion
                {
                    Id = Guid.NewGuid(),
                    HabitId = habit.Id,
                    Date = today.AddDays(-1),
                    Status = HabitCompletionStatus.Missed,
                    CompletedAt = null
                }
            );
            await context.SaveChangesAsync();

            var handler = new GetHabitByIdHandler(context, new FakeCurrentUserService(userId));
            var result = await handler.Handle(new GetHabitByIdQuery(habit.Id), CancellationToken.None);

            Assert.Equal(habit.Id, result.Id);
            Assert.Equal("Meditation", result.Name);
            Assert.Equal(2, result.RecentCompletions.Count);
            Assert.Contains(result.RecentCompletions, c => c.Date == today && c.Status == HabitCompletionStatus.Completed);
            Assert.Contains(result.RecentCompletions, c => c.Date == today.AddDays(-1) && c.Status == HabitCompletionStatus.Missed);

            output.WriteLine("Habit details with completions returned successfully");
        }
    }
}
