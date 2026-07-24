using LifeOrganizer.Application.Todo.Commands.GetAllTodo;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Todo
{
    public class GetAllTodosTests
    {
        private readonly ITestOutputHelper output;
        public GetAllTodosTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetAllTodos_ShouldReturnOnlyCurrentUserTodos()
        {
            var context = TestDbContextFactory.Create();
            var user1 = Guid.NewGuid();
            var user2 = Guid.NewGuid();

            context.TodoItems.AddRange(
                new TodoItem
                {
                    Id = Guid.NewGuid(),
                    UserId = user1,
                    Title = "User 1 task"
                },

                new TodoItem
                {
                    Id = Guid.NewGuid(),
                    UserId = user2,
                    Title = "User 2 task"
                }
            );

            await context.SaveChangesAsync();

            var handler = new GetAllTodosHandler(
                context,
                new FakeCurrentUserService(user1)
            );

            var result = await handler.Handle(
                new GetAllTodosQuery(),
                CancellationToken.None
            );

            Assert.Single(result);
            Assert.Equal(
                "User 1 task",
                result.First().Title
            );

            output.WriteLine("Successfully showed only current user todos");
        }
    }
}
