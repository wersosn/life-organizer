using LifeOrganizer.Application.Todo.Commands.DeleteTodo;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Todo
{
    public class DeleteTodoTests
    {
        private readonly ITestOutputHelper output;
        public DeleteTodoTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task DeleteTodo_ShouldRemoveTodo()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();

            var todo = new TodoItem
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = "Delete me"
            };

            context.TodoItems.Add(todo);
            await context.SaveChangesAsync();

            var handler = new DeleteTodoHandler(
                context,
                new FakeCurrentUserService(userId)
            );

            await handler.Handle(
                new DeleteTodoCommand(todo.Id),
                CancellationToken.None
            );

            var exists = await context.TodoItems.AnyAsync();
            Assert.False(exists);
            output.WriteLine("Task deleted successfully");
        }
    }
}
