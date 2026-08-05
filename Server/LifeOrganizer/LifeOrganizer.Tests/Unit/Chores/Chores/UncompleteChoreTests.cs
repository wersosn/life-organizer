using LifeOrganizer.Application.Chores.Commands.Chore.UncompleteChore;
using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Chores.Chores
{
    public class UncompleteChoreTests
    {
        private readonly ITestOutputHelper output;
        public UncompleteChoreTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task UncompleteChore_ShouldRemoveLatestCompletion_AndUpdateLastCompletedAt()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var olderDate = DateTime.UtcNow.AddDays(-5);
            var newerDate = DateTime.UtcNow.AddDays(-1);

            var chore = new Chore
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Vacuum",
                LastCompletedAt = newerDate,
                IsActive = true
            };
            context.Chores.Add(chore);

            var olderCompletion = new ChoreCompletion
            {
                Id = Guid.NewGuid(),
                ChoreId = chore.Id,
                CompletedAt = olderDate
            };
            var newerCompletion = new ChoreCompletion
            {
                Id = Guid.NewGuid(),
                ChoreId = chore.Id,
                CompletedAt = newerDate
            };            
            context.ChoreCompletions.AddRange(olderCompletion, newerCompletion);
            await context.SaveChangesAsync();

            var handler = new UncompleteChoreHandler(context, new FakeCurrentUserService(userId));
            await handler.Handle(new UncompleteChoreCommand(chore.Id), CancellationToken.None);
            Assert.Single(context.ChoreCompletions);

            var remaining = await context.ChoreCompletions.FirstAsync();
            Assert.Equal(olderCompletion.Id, remaining.Id);

            var updatedChore = await context.Chores.FirstAsync();
            Assert.Equal(olderDate, updatedChore.LastCompletedAt);

            output.WriteLine("Latest completion removed successfully.");
        }

        [Fact]
        public async Task UncompleteChore_ShouldSetLastCompletedAtToNull_WhenLastCompletionRemoved()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var completedAt = DateTime.UtcNow;

            var chore = new Chore
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Laundry",
                LastCompletedAt = completedAt,
                IsActive = true
            };

            var completion = new ChoreCompletion
            {
                Id = Guid.NewGuid(),
                ChoreId = chore.Id,
                CompletedAt = completedAt
            };
            context.Chores.Add(chore);
            context.ChoreCompletions.Add(completion);
            await context.SaveChangesAsync();

            var handler = new UncompleteChoreHandler(context, new FakeCurrentUserService(userId));

            await handler.Handle(new UncompleteChoreCommand(chore.Id), CancellationToken.None);
            Assert.Empty(context.ChoreCompletions);

            var updatedChore = await context.Chores.FirstAsync();
            Assert.Null(updatedChore.LastCompletedAt);

            output.WriteLine("Single completion removed successfully.");
        }

        [Fact]
        public async Task UncompleteChore_ShouldDoNothing_WhenNoCompletionsExist()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();

            var chore = new Chore
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Windows",
                IsActive = true
            };
            context.Chores.Add(chore);
            await context.SaveChangesAsync();

            var handler = new UncompleteChoreHandler(context, new FakeCurrentUserService(userId));
            await handler.Handle(new UncompleteChoreCommand(chore.Id), CancellationToken.None);
            Assert.Empty(context.ChoreCompletions);

            var updatedChore = await context.Chores.FirstAsync();
            Assert.Null(updatedChore.LastCompletedAt);

            output.WriteLine("Nothing happened because no completions existed.");
        }

        [Fact]
        public async Task UncompleteChore_ShouldThrowNotFound_WhenChoreDoesNotBelongToUser()
        {
            var context = TestDbContextFactory.Create();
            var ownerId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            var chore = new Chore
            {
                Id = Guid.NewGuid(),
                UserId = otherUserId,
                Name = "Kitchen",
                IsActive = true
            };
            context.Chores.Add(chore);
            await context.SaveChangesAsync();

            var handler = new UncompleteChoreHandler(context, new FakeCurrentUserService(ownerId));           
            await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(new UncompleteChoreCommand(chore.Id), CancellationToken.None));

            output.WriteLine("Correctly rejected uncompletion for another user's chore.");
        }
    }
}
