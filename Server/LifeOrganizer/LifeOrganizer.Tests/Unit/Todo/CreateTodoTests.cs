using LifeOrganizer.Application.Todo.Commands.CreateTodo;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Todo
{
    public class CreateTodoTests
    {
        private readonly ITestOutputHelper output;
        public CreateTodoTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task CreateTodo_ShouldCreateTodoForCurrentUser()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var currentUser = new FakeCurrentUserService(userId);

            var handler = new CreateTodoHandler(
                context,
                currentUser
            );

            var command = new CreateTodoCommand(
                "Test task",
                "Description"
            );

            var result = await handler.Handle(
                command,
                CancellationToken.None
            );

            var todo = await context.TodoItems.FirstAsync();

            Assert.Equal(result, todo.Id);
            Assert.Equal(userId, todo.UserId);
            Assert.Equal("Test task", todo.Title);

            output.WriteLine("New task created successfully");
        }
    }
}
