using LifeOrganizer.Application.Chores.Commands.Chore.GetChoreById;
using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Chores.Chores
{
    public class GetChoreByIdTests
    {
        private readonly ITestOutputHelper output;
        public GetChoreByIdTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetChoreById_ShouldThrowNotFound_WhenChoreBelongsToDifferentUser()
        {
            var context = TestDbContextFactory.Create();
            var ownerId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            var category = new ChoreCategory 
            { 
                Id = Guid.NewGuid(), 
                UserId = ownerId, 
                Name = "Kitchen" 
            };
            context.ChoreCategories.Add(category);

            var chore = new Chore
            {
                Id = Guid.NewGuid(),
                UserId = ownerId,
                CategoryId = category.Id,
                Name = "Mop floor",
                FrequencyUnit = ChoreFrequency.Days,
                FrequencyValue = 3,
                IsActive = true
            };
            context.Chores.Add(chore);
            await context.SaveChangesAsync();

            var handler = new GetChoreByIdHandler(context, new FakeCurrentUserService(otherUserId));
            await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(new GetChoreByIdQuery(chore.Id), CancellationToken.None));

            output.WriteLine("Correctly hid existence of another user's chore");
        }

        [Fact]
        public async Task GetChoreById_ShouldReturnRecentCompletionsOrderedByMostRecentFirst()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();

            var category = new ChoreCategory 
            { 
                Id = Guid.NewGuid(), 
                UserId = userId, 
                Name = "Kitchen" 
            };
            context.ChoreCategories.Add(category);

            var chore = new Chore
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CategoryId = category.Id,
                Name = "Wash dishes",
                FrequencyUnit = ChoreFrequency.Days,
                FrequencyValue = 1,
                LastCompletedAt = DateTime.UtcNow.AddDays(-1),
                IsActive = true
            };
            context.Chores.Add(chore);

            context.ChoreCompletions.AddRange(
                new ChoreCompletion { Id = Guid.NewGuid(), ChoreId = chore.Id, CompletedAt = DateTime.UtcNow.AddDays(-1), Notes = "Recent" },
                new ChoreCompletion { Id = Guid.NewGuid(), ChoreId = chore.Id, CompletedAt = DateTime.UtcNow.AddDays(-5), Notes = "Older" }
            );
            await context.SaveChangesAsync();

            var handler = new GetChoreByIdHandler(context, new FakeCurrentUserService(userId));
            var result = await handler.Handle(new GetChoreByIdQuery(chore.Id), CancellationToken.None);
            Assert.Equal(2, result.RecentCompletions.Count);
            Assert.Equal("Recent", result.RecentCompletions[0].Notes);
            Assert.Equal("Older", result.RecentCompletions[1].Notes);

            output.WriteLine("Recent completions correctly ordered, most recent first");
        }
    }
}
