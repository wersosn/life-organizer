using LifeOrganizer.Application.Todo.Commands.UpdateTodo;
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
    public class UpdateTodoTests
    {
        private readonly ITestOutputHelper output;
        public UpdateTodoTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task UpdateTodo_ShouldChangeTitle()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();

            var todo = new TodoItem
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = "Old"
            };

            context.TodoItems.Add(todo);
            await context.SaveChangesAsync();

            var handler = new UpdateTodoHandler(
                context,
                new FakeCurrentUserService(userId)
            );

            await handler.Handle(
                new UpdateTodoCommand(
                    todo.Id,
                    "New",
                    "Description"
                ),
                CancellationToken.None
            );

            var updated = await context.TodoItems.FirstAsync();
            Assert.Equal("New", updated.Title);
            output.WriteLine("Task updated successfully");
        }
    }
}
