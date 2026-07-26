using LifeOrganizer.Application.Habits.Commands.UncompleteHabit;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Habits
{
    public class UncompleteHabitTests
    {
        private readonly ITestOutputHelper output;
        public UncompleteHabitTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task UncompleteHabit_ShouldRemoveCompletionRecord()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var habit = new Habit
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Walking",
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
                Status = HabitCompletionStatus.Completed,
                CompletedAt = DateTime.UtcNow
            });
            await context.SaveChangesAsync();

            var handler = new UncompleteHabitHandler(context, new FakeCurrentUserService(userId));
            await handler.Handle(new UncompleteHabitCommand(habit.Id, null), CancellationToken.None);

            Assert.Empty(await context.HabitCompletions.ToListAsync());

            output.WriteLine("Completion record removed successfully");
        }

        [Fact]
        public async Task UncompleteHabit_ShouldDoNothing_WhenNoRecordExists()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var habit = new Habit
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Flossing",
                Frequency = Domain.Enums.HabitFrequency.Daily,
                IsActive = true
            };
            context.Habits.Add(habit);
            await context.SaveChangesAsync();

            var handler = new UncompleteHabitHandler(context, new FakeCurrentUserService(userId));
            await handler.Handle(new UncompleteHabitCommand(habit.Id, null), CancellationToken.None);

            Assert.Empty(await context.HabitCompletions.ToListAsync());

            output.WriteLine("Uncomplete on nonexistent record handled idempotently");
        }
    }
}
