using LifeOrganizer.Application.Habits.Commands.DeleteHabit;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Habits
{
    public class DeleteHabitTests
    {
        private readonly ITestOutputHelper output;
        public DeleteHabitTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task DeleteHabit_ShouldRemoveHabit()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var currentUser = new FakeCurrentUserService(userId);

            var habit = new Habit
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Delete me",
                Frequency = Domain.Enums.HabitFrequency.Daily,
                ScheduledDays = new List<DayOfWeek>(),
                CompletionDeadline = null
            };

            context.Habits.Add(habit);
            await context.SaveChangesAsync();

            var handler = new DeleteHabitHandler(
                context,
                currentUser
            );

            await handler.Handle(
                new DeleteHabitCommand(habit.Id),
                CancellationToken.None
            );

            var exists = await context.Habits.AnyAsync();
            Assert.False(exists);
            output.WriteLine("Habit deleted successfully");
        }
    }
}
