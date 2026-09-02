using LifeOrganizer.Application.Habits.Commands.CompleteHabit;
using LifeOrganizer.Application.Habits.Commands.CreateHabit;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Habits
{
    public class CreateHabitTests
    {
        private readonly ITestOutputHelper output;
        public CreateHabitTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task CreateHabit_ShouldCreateHabitForCurrentUser()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var currentUser = new FakeCurrentUserService(userId);

            var handler = new CreateHabitHandler(
                context,
                currentUser,
                NullLogger<CreateHabitHandler>.Instance
            );

            var command = new CreateHabitCommand(
                Guid.NewGuid(),
                "Test habit",
                Domain.Enums.HabitFrequency.Daily,
                new List<DayOfWeek>(),
                null
            );

            var result = await handler.Handle(
                command,
                CancellationToken.None
            );

            var habit = await context.Habits.FirstAsync();

            Assert.Equal(result, habit.Id);
            Assert.Equal(userId, habit.UserId);
            Assert.Equal("Test habit", habit.Name);
            Assert.Equal(Domain.Enums.HabitFrequency.Daily, habit.Frequency);
            Assert.True(habit.IsActive);

            output.WriteLine("New habit created successfully");
        }

        [Fact]
        public async Task CreateHabit_WeeklyFrequency_ShouldStoreScheduledDays()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var handler = new CreateHabitHandler(
                context,
                new FakeCurrentUserService(userId),
                NullLogger<CreateHabitHandler>.Instance
            );

            var command = new CreateHabitCommand(
                Guid.NewGuid(),
                "Gym",
                Domain.Enums.HabitFrequency.Weekly,
                new List<DayOfWeek> { DayOfWeek.Monday, DayOfWeek.Thursday },
                new TimeSpan(20, 0, 0)
            );

            await handler.Handle(command, CancellationToken.None);

            var habit = await context.Habits.FirstAsync();

            Assert.Equal(2, habit.ScheduledDays.Count);
            Assert.Contains(DayOfWeek.Monday, habit.ScheduledDays);
            Assert.Contains(DayOfWeek.Thursday, habit.ScheduledDays);
            Assert.Equal(new TimeSpan(20, 0, 0), habit.CompletionDeadline);

            output.WriteLine("Habit with weekly schedule created successfully");
        }
    }
}
