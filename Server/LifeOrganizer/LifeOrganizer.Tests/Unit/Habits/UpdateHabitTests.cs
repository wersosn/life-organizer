using LifeOrganizer.Application.Habits.Commands.UpdateHabit;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Habits
{
    public class UpdateHabitTests
    {
        private readonly ITestOutputHelper output;
        public UpdateHabitTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task UpdateHabit_ShouldChangeName()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();

            var habit = new Habit
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Old",
                Frequency = Domain.Enums.HabitFrequency.Daily,
                ScheduledDays = new List<DayOfWeek>(),
                CompletionDeadline = null
            };

            context.Habits.Add(habit);
            await context.SaveChangesAsync();

            var handler = new UpdateHabitHandler(
                context,
                new FakeCurrentUserService(userId)
            );

            await handler.Handle(
                new UpdateHabitCommand(
                    habit.Id,
                    "New",
                    Domain.Enums.HabitFrequency.Daily,
                    new List<DayOfWeek>(),
                    null
                ),
                CancellationToken.None
            );

            var updated = await context.Habits.FirstAsync();
            Assert.Equal("New", updated.Name);
            output.WriteLine("Habit name updated successfully");
        }
    }
}
