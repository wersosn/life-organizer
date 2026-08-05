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
    }
}
