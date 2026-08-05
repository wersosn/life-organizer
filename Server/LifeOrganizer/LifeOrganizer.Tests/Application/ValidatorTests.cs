using LifeOrganizer.Application.Habits.Commands.CreateHabit;
using LifeOrganizer.Domain.Enums;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Application
{
    public class ValidatorTests
    {
        private readonly ITestOutputHelper output;
        public ValidatorTests(ITestOutputHelper output)
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
    }
}
