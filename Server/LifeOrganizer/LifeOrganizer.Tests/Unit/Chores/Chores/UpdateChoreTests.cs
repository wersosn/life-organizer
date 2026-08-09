using LifeOrganizer.Application.Chores.Commands.Chore.UncompleteChore;
using LifeOrganizer.Application.Chores.Commands.Chore.UpdateChore;
using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Chores.Chores
{
    public class UpdateChoreTests
    {
        private readonly ITestOutputHelper output;
        public UpdateChoreTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task UpdateChore_ShouldThrowNotFound_WhenNewCategoryDoesNotBelongToUser()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            var category = new ChoreCategory 
            { 
                Id = Guid.NewGuid(), 
                UserId = userId, 
                Name = "Kitchen" 
            };
            var foreignCategory = new ChoreCategory 
            { 
                Id = Guid.NewGuid(), 
                UserId = otherUserId, 
                Name = "Not yours" 
            };
            context.ChoreCategories.AddRange(category, foreignCategory);

            var chore = new Chore
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CategoryId = category.Id,
                Name = "Wash dishes",
                FrequencyUnit = ChoreFrequency.Days,
                FrequencyValue = 1,
                IsActive = true
            };
            context.Chores.Add(chore);
            await context.SaveChangesAsync();

            var handler = new UpdateChoreHandler(context, new FakeCurrentUserService(userId), NullLogger<UpdateChoreHandler>.Instance);
            var command = new UpdateChoreCommand(chore.Id, "Wash dishes", null, foreignCategory.Id, ChoreFrequency.Days, 1, true);
            await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));

            output.WriteLine("Correctly rejected reassignment to another user's category");
        }
    }
}
