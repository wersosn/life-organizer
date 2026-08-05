using LifeOrganizer.Application.Chores.Commands.ChoreCategories.GetChoreCategoryById;
using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Chores.ChoreCategories
{
    public class GetChoreCategoryByIdTests
    {
        private readonly ITestOutputHelper output;
        public GetChoreCategoryByIdTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetChoreCategoryById_ShouldThrowNotFound_WhenCategoryBelongsToDifferentUser()
        {
            var context = TestDbContextFactory.Create();
            var ownerId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            var category = new ChoreCategory 
            { 
                Id = Guid.NewGuid(), 
                UserId = ownerId, 
                Name = "Bathroom" 
            };
            context.ChoreCategories.Add(category);
            await context.SaveChangesAsync();

            var handler = new GetChoreCategoryByIdHandler(context, new FakeCurrentUserService(otherUserId));
            await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(new GetChoreCategoryByIdQuery(category.Id), CancellationToken.None));

            output.WriteLine("Correctly hid existence of another user's chore category");
        }
    }
}
