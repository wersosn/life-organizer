using LifeOrganizer.Application.Todo.Commands.GetTodoById;
using LifeOrganizer.Application.Users.Commands.RegisterUser;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Todo
{
    public class GetTodoByIdTests
    {
        private readonly ITestOutputHelper output;
        public GetTodoByIdTests(ITestOutputHelper output)
        {
            this.output = output;
        }


        [Fact]
        public async Task GetTodoById_ShouldReturnTodoWithTitle()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var todo = new TodoItem
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = "Clean my desk",
                Description = "You should clean your desk asap"
            };
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            context.TodoItems.Add(todo);
            await context.SaveChangesAsync();

            var handler = new GetTodoByIdHandler(context, new FakeCurrentUserService(userId), NullLogger<GetTodoByIdHandler>.Instance);
            var result = await handler.Handle(new GetTodoByIdQuery(todo.Id), CancellationToken.None);

            Assert.Equal(todo.Id, result.Id);
            Assert.Equal("Clean my desk", result.Title);
            Assert.Equal("You should clean your desk asap", result.Description);

            output.WriteLine("Todo details returned successfully");
        }
    }
}
