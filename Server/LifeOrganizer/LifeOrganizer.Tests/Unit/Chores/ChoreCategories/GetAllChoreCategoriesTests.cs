using LifeOrganizer.Application.Chores.Commands.ChoreCategories.GetAllChoreCategories;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Chores.ChoreCategories
{
    public class GetAllChoreCategoriesTests
    {
        private readonly ITestOutputHelper output;
        public GetAllChoreCategoriesTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetAllChoreCategories_ShouldReturnOnlyCurrentUserCategories()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            context.ChoreCategories.AddRange(
                new ChoreCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Kitchen" },
                new ChoreCategory { Id = Guid.NewGuid(), UserId = otherUserId, Name = "Other user's category" }
            );
            await context.SaveChangesAsync();

            var handler = new GetAllChoreCategoriesHandler(context, new FakeCurrentUserService(userId));

            var result = await handler.Handle(new GetAllChoreCategoriesQuery(), CancellationToken.None);
            Assert.Single(result);
            Assert.Equal("Kitchen", result.First().Name);

            output.WriteLine("Correctly returned only current user's chore categories");
        }
    }
}
