using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Domain.Services;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.BackgroundServices
{
    public class HabitTaskDeciderTests
    {
        private readonly ITestOutputHelper output;
        public HabitTaskDeciderTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public void ShouldCreateTask_ShouldReturnFalse_WhenTaskAlreadyExistsToday()
        {
            var habit = new Habit 
            { 
                Frequency = HabitFrequency.Daily, 
                CompletionDeadline = null 
            };
            var today = new DateOnly(2026, 8, 10);
            var now = new DateTime(2026, 8, 10, 23, 59, 59);

            var result = HabitTaskDecider.ShouldCreateTask(habit, today, now, existingStatus: null, taskAlreadyExistsToday: true);

            Assert.False(result);

            output.WriteLine("Verified that a task is not created when a task already exists for today.");
        }

        [Fact]
        public void ShouldCreateTask_ShouldReturnTrue_WhenMissedAndNoExistingTask()
        {
            var habit = new Habit 
            { 
                Frequency = HabitFrequency.Daily, 
                CompletionDeadline = new TimeSpan(9, 0, 0) 
            };
            var today = new DateOnly(2026, 8, 10);
            var now = new DateTime(2026, 8, 10, 10, 0, 0);

            var result = HabitTaskDecider.ShouldCreateTask(habit, today, now, existingStatus: null, taskAlreadyExistsToday: false);

            Assert.True(result);

            output.WriteLine("Verified that a task is created when the habit is missed and no task exists for today.");
        }

        [Fact]
        public void ShouldCreateTask_ShouldReturnFalse_WhenNotYetMissed()
        {
            var habit = new Habit 
            { 
                Frequency = HabitFrequency.Daily, 
                CompletionDeadline = new TimeSpan(20, 0, 0) 
            };
            var today = new DateOnly(2026, 8, 10);
            var now = new DateTime(2026, 8, 10, 10, 0, 0);

            var result = HabitTaskDecider.ShouldCreateTask(habit, today, now, existingStatus: null, taskAlreadyExistsToday: false);

            Assert.False(result);

            output.WriteLine("Verified that a task is not created when the habit has not been missed yet.");
        }
    }
}
