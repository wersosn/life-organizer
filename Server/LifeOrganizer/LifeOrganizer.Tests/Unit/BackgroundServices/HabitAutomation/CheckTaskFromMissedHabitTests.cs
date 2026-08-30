using LifeOrganizer.Application.Common.Events;
using LifeOrganizer.Application.Habits.EventHandlers;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.BackgroundServices.HabitAutomation
{
    public class CheckTaskFromMissedHabitTests
    {
        private readonly ITestOutputHelper output;
        public CheckTaskFromMissedHabitTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task Handle_ShouldCreateTodoItem_WithCorrectSourceAndSourceId()
        {
            var context = TestDbContextFactory.Create();
            var handler = new CreateTaskFromMissedHabitHandler(context, NullLogger<CreateTaskFromMissedHabitHandler>.Instance);
            var habitId = Guid.NewGuid();
            var userId = Guid.NewGuid();

            await handler.Handle(new HabitMissedEvent(habitId, userId, "Meditation"), CancellationToken.None);

            var task = await context.TodoItems.FirstAsync();
            Assert.Equal("Meditation", task.Title);
            Assert.Equal(TaskSource.HabitAutomation, task.Source);
            Assert.Equal(habitId, task.SourceId);
            Assert.Equal(userId, task.UserId);

            output.WriteLine("Task correctly created from HabitMissedEvent");
        }
    }
}
