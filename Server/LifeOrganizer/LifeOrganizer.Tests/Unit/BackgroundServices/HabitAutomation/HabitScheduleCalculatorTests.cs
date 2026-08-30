using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Domain.Services;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.BackgroundServices.HabitAutomation
{
    public class HabitScheduleCalculatorTests
    {
        private readonly ITestOutputHelper output;
        public HabitScheduleCalculatorTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public void IsMissed_ShouldReturnFalse_WhenHabitNotScheduledForToday()
        {
            var habit = new Habit
            {
                Frequency = HabitFrequency.Weekly,
                ScheduledDays = new List<DayOfWeek> { DayOfWeek.Monday }
            };
            var tuesday = new DateOnly(2026, 8, 11); // tuesday

            var result = HabitScheduleCalculator.IsMissed(habit, tuesday, DateTime.UtcNow, null);
            Assert.False(result);

            output.WriteLine("Verified that a habit is not missed when it is not scheduled for the current day");
        }

        [Fact]
        public void IsMissed_ShouldReturnFalse_WhenAlreadyCompleted()
        {
            var habit = new Habit
            {
                Frequency = HabitFrequency.Daily
            };
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var result = HabitScheduleCalculator.IsMissed(habit, today, DateTime.UtcNow, HabitCompletionStatus.Completed);
            Assert.False(result);

            output.WriteLine("Verified that a completed habit is not marked as missed");
        }

        [Fact]
        public void IsMissed_ShouldReturnFalse_WhenDeadlineHasNotPassedYet()
        {
            var habit = new Habit
            {
                Frequency = HabitFrequency.Daily,
                CompletionDeadline = new TimeSpan(20, 0, 0)
            };
            var today = new DateOnly(2026, 8, 10);
            var now = new DateTime(2026, 8, 10, 15, 0, 0); // 15:00, deadline at 20:00

            var result = HabitScheduleCalculator.IsMissed(habit, today, now, null);
            Assert.False(result);

            output.WriteLine("Verified that a habit is not missed before its completion deadline has passed");
        }

        [Fact]
        public void IsMissed_ShouldReturnTrue_WhenDeadlineHasPassedAndNotCompleted()
        {
            var habit = new Habit
            {
                Frequency = HabitFrequency.Daily,
                CompletionDeadline = new TimeSpan(20, 0, 0)
            };
            var today = new DateOnly(2026, 8, 10);
            var now = new DateTime(2026, 8, 10, 21, 0, 0); // 21:00, after deadline

            var result = HabitScheduleCalculator.IsMissed(habit, today, now, null);
            Assert.True(result);

            output.WriteLine("Verified that an incomplete habit is marked as missed after its completion deadline has passed");
        }

        [Fact]
        public void IsMissed_ShouldReturnFalse_BeforeEndOfDay_WhenNoDeadlineSet()
        {
            var habit = new Habit
            {
                Frequency = HabitFrequency.Daily,
                CompletionDeadline = null
            };
            var today = new DateOnly(2026, 8, 10);
            var now = new DateTime(2026, 8, 10, 12, 0, 0); // afternoon

            var result = HabitScheduleCalculator.IsMissed(habit, today, now, null);
            Assert.False(result);

            output.WriteLine("Verified that a habit without a deadline is not missed before the end of the day");
        }

        [Fact]
        public void IsMissed_ShouldReturnTrue_WhenNoCompletionExistsAtAll()
        {
            var habit = new Habit
            {
                Frequency = HabitFrequency.Daily,
                CompletionDeadline = new TimeSpan(9, 0, 0)
            };
            var today = new DateOnly(2026, 8, 10);
            var now = new DateTime(2026, 8, 10, 10, 0, 0);

            var result = HabitScheduleCalculator.IsMissed(habit, today, now, existingStatus: null); // existingStatus = null
            Assert.True(result);

            output.WriteLine("Verified that a habit without completions is marked as missed");
        }
    }
}
