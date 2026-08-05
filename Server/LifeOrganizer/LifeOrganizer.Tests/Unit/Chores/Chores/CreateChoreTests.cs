using LifeOrganizer.Application.Chores.Commands.Chore.CreateChore;
using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Chores.Chores
{
    public class CreateChoreTests
    {
        private readonly ITestOutputHelper output;
        public CreateChoreTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task CreateChore_ShouldCreateForCurrentUser()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();

            var category = new ChoreCategory 
            { 
                Id = Guid.NewGuid(), 
                UserId = userId, 
                Name = "Bedroom" 
            };
            context.ChoreCategories.Add(category);
            await context.SaveChangesAsync();

            var handler = new CreateChoreHandler(context, new FakeCurrentUserService(userId));
            var command = new CreateChoreCommand("Change bedsheets", null, category.Id, ChoreFrequency.Weeks, 3);

            var result = await handler.Handle(command, CancellationToken.None);

            var chore = await context.Chores.FirstAsync();
            Assert.Equal(result, chore.Id);
            Assert.Equal(userId, chore.UserId);
            Assert.Equal("Change bedsheets", chore.Name);
            Assert.Null(chore.LastCompletedAt);
            Assert.True(chore.IsActive);

            output.WriteLine("Chore created successfully");
        }

        [Fact]
        public async Task CreateChore_ShouldThrowNotFound_WhenCategoryDoesNotBelongToUser()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            var foreignCategory = new ChoreCategory 
            { 
                Id = Guid.NewGuid(), 
                UserId = otherUserId, 
                Name = "Not yours" 
            };
            context.ChoreCategories.Add(foreignCategory);
            await context.SaveChangesAsync();

            var handler = new CreateChoreHandler(context, new FakeCurrentUserService(userId));
            var command = new CreateChoreCommand("Vacuum", null, foreignCategory.Id, ChoreFrequency.Days, 7);
            await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));

            output.WriteLine("Correctly rejected chore creation with another user's category");
        }
    }
}
