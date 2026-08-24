using LifeOrganizer.Application.Habits.Commands.CreateHabit;
using LifeOrganizer.Application.Retention.Commands.UpdateRetentionSettings;
using LifeOrganizer.Domain.Enums;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Application
{
    public class DaysValidatorTests
    {
        private readonly ITestOutputHelper output;
        public DaysValidatorTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public void Validator_ShouldFail_WhenWeeklyFrequencyHasNoScheduledDays()
        {
            var validator = new CreateHabitValidator();
            var command = new CreateHabitCommand("Gym", HabitFrequency.Weekly, new List<DayOfWeek>(), null);

            var result = validator.Validate(command);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(CreateHabitCommand.ScheduledDays));
        }

        [Theory]
        [InlineData(0)]
        [InlineData(366)]
        [InlineData(-5)]
        public void Validator_ShouldFail_WhenRetentionDaysOutOfRange(int days)
        {
            var validator = new UpdateRetentionSettingsValidator();
            var result = validator.Validate(new UpdateRetentionSettingsCommand(days));

            Assert.False(result.IsValid);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(30)]
        [InlineData(365)]
        public void Validator_ShouldPass_WhenRetentionDaysWithinRange(int days)
        {
            var validator = new UpdateRetentionSettingsValidator();
            var result = validator.Validate(new UpdateRetentionSettingsCommand(days));

            Assert.True(result.IsValid);
        }
    }
}
