using LifeOrganizer.Application.Habits.Commands.CompleteHabit;
using LifeOrganizer.Application.Todo.Commands.CompleteTodo;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Habits
{
    public class CompleteHabitTests
    {
        private readonly ITestOutputHelper output;
        public CompleteHabitTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task CompleteHabit_ShouldCreateCompletionRecord_WhenNoneExists()
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
            context.Habits.Add(habit);
            await context.SaveChangesAsync();

            var handler = new CompleteHabitHandler(context, new FakeCurrentUserService(userId), NullLogger<CompleteHabitHandler>.Instance);
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var completionId = await handler.Handle(
                new CompleteHabitCommand(habit.Id, null),
                CancellationToken.None
            );

            var completion = await context.HabitCompletions.FirstAsync();

            Assert.Equal(completionId, completion.Id);
            Assert.Equal(habit.Id, completion.HabitId);
            Assert.Equal(today, completion.Date);
            Assert.Equal(HabitCompletionStatus.Completed, completion.Status);
            Assert.NotNull(completion.CompletedAt);

            output.WriteLine("Habit completed successfully");
        }

        [Fact]
        public async Task CompleteHabit_ShouldOverwriteMissedRecord_WhenAutomationAlreadyMarkedIt()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var habit = new Habit
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Reading",
                Frequency = Domain.Enums.HabitFrequency.Daily,
                IsActive = true
            };
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            context.Habits.Add(habit);
            context.HabitCompletions.Add(new HabitCompletion
            {
                Id = Guid.NewGuid(),
                HabitId = habit.Id,
                Date = today,
                Status = HabitCompletionStatus.Missed,
                CompletedAt = null
            });
            await context.SaveChangesAsync();

            var handler = new CompleteHabitHandler(context, new FakeCurrentUserService(userId), NullLogger<CompleteHabitHandler>.Instance);
            await handler.Handle(new CompleteHabitCommand(habit.Id, null), CancellationToken.None);
            var completion = await context.HabitCompletions.FirstAsync();

            Assert.Equal(HabitCompletionStatus.Completed, completion.Status);
            Assert.NotNull(completion.CompletedAt);
            Assert.Equal(1, await context.HabitCompletions.CountAsync());

            output.WriteLine("Missed completion overwritten as Completed");
        }

        [Fact]
        public async Task CompleteHabit_ShouldBeIdempotent_WhenCalledTwice()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var habit = new Habit
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Stretching",
                Frequency = Domain.Enums.HabitFrequency.Daily,
                IsActive = true
            };
            context.Habits.Add(habit);
            await context.SaveChangesAsync();

            var handler = new CompleteHabitHandler(context, new FakeCurrentUserService(userId), NullLogger<CompleteHabitHandler>.Instance);
            var firstId = await handler.Handle(new CompleteHabitCommand(habit.Id, null), CancellationToken.None);
            var secondId = await handler.Handle(new CompleteHabitCommand(habit.Id, null), CancellationToken.None);

            Assert.Equal(firstId, secondId);
            Assert.Equal(1, await context.HabitCompletions.CountAsync());

            output.WriteLine("Double completion did not create duplicate record");
        }
    }
}
