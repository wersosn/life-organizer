using LifeOrganizer.Application.Todo.Commands.CompleteTodo;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestPlatform.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Todo
{
    public class CompleteTodoTests
    {
        private readonly ITestOutputHelper output;
        public CompleteTodoTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task CompleteTodo_ShouldMarkTodoAsCompleted()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();

            var todo = new TodoItem
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = "Task"
            };

            context.TodoItems.Add(todo);
            await context.SaveChangesAsync();

            var handler = new CompleteTodoHandler(
                context,
                new FakeCurrentUserService(userId)
            );

            await handler.Handle(
                new CompleteTodoCommand(todo.Id),
                CancellationToken.None
            );

            var updated = await context.TodoItems.FirstAsync();

            Assert.True(updated.IsCompleted);
            Assert.NotNull(updated.CompletedAt);

            output.WriteLine("Task completed uccessfully");
        }
    }
}
