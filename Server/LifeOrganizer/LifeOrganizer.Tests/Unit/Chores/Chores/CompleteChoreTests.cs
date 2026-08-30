using LifeOrganizer.Application.Chores.Commands.Chore.CompleteChore;
using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Chores.Chores
{
    public class CompleteChoreTests
    {
        private readonly ITestOutputHelper output;
        public CompleteChoreTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task CompleteChore_ShouldCreateCompletionAndUpdateChore()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();

            var chore = new Chore
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Vacuum",
                IsActive = true
            };
            context.Chores.Add(chore);
            await context.SaveChangesAsync();

            var completedAt = DateTime.UtcNow.AddHours(-1);
            var handler = new CompleteChoreHandler(context, new FakeCurrentUserService(userId), NullLogger<CompleteChoreHandler>.Instance);
            var command = new CompleteChoreCommand(chore.Id, completedAt, "Finished");
            var result = await handler.Handle(command, CancellationToken.None);
            var completion = await context.ChoreCompletions.FirstAsync();

            Assert.Equal(result, completion.Id);
            Assert.Equal(chore.Id, completion.ChoreId);
            Assert.Equal(completedAt, completion.CompletedAt);
            Assert.Equal("Finished", completion.Notes);

            var updatedChore = await context.Chores.FirstAsync();
            Assert.Equal(completedAt, updatedChore.LastCompletedAt);

            output.WriteLine("Completion created successfully.");
        }

        [Fact]
        public async Task CompleteChore_ShouldThrowNotFound_WhenChoreDoesNotBelongToUser()
        {
            var context = TestDbContextFactory.Create();
            var ownerId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            var chore = new Chore
            {
                Id = Guid.NewGuid(),
                UserId = otherUserId,
                Name = "Laundry",
                IsActive = true
            };
            context.Chores.Add(chore);
            await context.SaveChangesAsync();

            var handler = new CompleteChoreHandler(context, new FakeCurrentUserService(ownerId), NullLogger<CompleteChoreHandler>.Instance);
            var command = new CompleteChoreCommand(chore.Id, DateTime.UtcNow, null);
            await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));

            output.WriteLine("Correctly rejected completion for another user's chore.");
        }

        [Fact]
        public async Task CompleteChore_ShouldNotOverwriteLastCompletedAt_WhenCompletionIsOlder()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var lastCompleted = DateTime.UtcNow;

            var chore = new Chore
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Windows",
                LastCompletedAt = lastCompleted,
                IsActive = true
            };
            context.Chores.Add(chore);
            await context.SaveChangesAsync();

            var olderCompletion = lastCompleted.AddDays(-2);
            var handler = new CompleteChoreHandler(context, new FakeCurrentUserService(userId), NullLogger<CompleteChoreHandler>.Instance);

            var command = new CompleteChoreCommand(chore.Id, olderCompletion, null);
            await handler.Handle(command, CancellationToken.None);
            var updatedChore = await context.Chores.FirstAsync();
            Assert.Equal(lastCompleted, updatedChore.LastCompletedAt);

            output.WriteLine("LastCompletedAt was not overwritten by older completion.");
        }
    }
}
