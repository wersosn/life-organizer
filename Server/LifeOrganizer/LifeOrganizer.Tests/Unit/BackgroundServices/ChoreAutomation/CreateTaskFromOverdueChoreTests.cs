using LifeOrganizer.Application.Chores.EventHandlers;
using LifeOrganizer.Application.Common.Events;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.BackgroundServices.ChoreAutomation
{
    public class CreateTaskFromOverdueChoreTests
    {
        private readonly ITestOutputHelper output;
        public CreateTaskFromOverdueChoreTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task Handle_ShouldCreateTodoItem_WithCorrectSourceAndSourceId()
        {
            var context = TestDbContextFactory.Create();
            var handler = new CreateTaskFromOverdueChoreHandler(context, NullLogger<CreateTaskFromOverdueChoreHandler>.Instance);
            var choreId = Guid.NewGuid();
            var userId = Guid.NewGuid();

            await handler.Handle(new ChoreOverdueEvent(choreId, userId, "Take out trash"), CancellationToken.None);

            var task = await context.TodoItems.FirstAsync();
            Assert.Equal("Take out trash", task.Title);
            Assert.Equal(TaskSource.ChoreAutomation, task.Source);
            Assert.Equal(choreId, task.SourceId);
            Assert.Equal(userId, task.UserId);

            output.WriteLine("Task correctly created from ChoreOverdueEvent");
        }
    }
}
