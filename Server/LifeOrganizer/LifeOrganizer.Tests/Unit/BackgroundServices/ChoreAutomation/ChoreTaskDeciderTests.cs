using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Domain.Services;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.BackgroundServices.ChoreAutomation
{
    public class ChoreTaskDeciderTests
    {
        private readonly ITestOutputHelper output;
        public ChoreTaskDeciderTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public void ShouldCreateTask_ShouldReturnFalse_WhenIncompleteTaskAlreadyExists()
        {
            var chore = new Chore
            {
                FrequencyUnit = ChoreFrequency.Days,
                FrequencyValue = 1,
                LastCompletedAt = null
            };
            var now = DateTime.UtcNow;

            var result = ChoreTaskDecider.ShouldCreateTask(chore, now, hasIncompleteAutomationTask: true);

            Assert.False(result);

            output.WriteLine("Verified that a task is not created when an incomplete task already exists.");
        }

        [Fact]
        public void ShouldCreateTask_ShouldReturnTrue_WhenOverdueAndNoIncompleteTask()
        {
            var chore = new Chore
            {
                FrequencyUnit = ChoreFrequency.Days,
                FrequencyValue = 7,
                LastCompletedAt = DateTime.UtcNow.AddDays(-10)
            };

            var result = ChoreTaskDecider.ShouldCreateTask(chore, DateTime.UtcNow, hasIncompleteAutomationTask: false);

            Assert.True(result);

            output.WriteLine("Verified that a task is created when the chore is overdue and no incomplete task exists.");
        }

        [Fact]
        public void ShouldCreateTask_ShouldReturnFalse_WhenNotOverdue()
        {
            var chore = new Chore
            {
                FrequencyUnit = ChoreFrequency.Days,
                FrequencyValue = 7,
                LastCompletedAt = DateTime.UtcNow.AddDays(-2)
            };

            var result = ChoreTaskDecider.ShouldCreateTask(chore, DateTime.UtcNow, hasIncompleteAutomationTask: false);

            Assert.False(result);

            output.WriteLine("Verified that a task is not created when the chore is not overdue.");
        }
    }
}
