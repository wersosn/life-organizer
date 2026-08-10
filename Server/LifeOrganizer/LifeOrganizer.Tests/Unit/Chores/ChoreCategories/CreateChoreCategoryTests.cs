using LifeOrganizer.Application.Chores.Commands.ChoreCategories.CreateChoreCategory;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Chores.ChoreCategories
{
    public class CreateChoreCategoryTests
    {
        private readonly ITestOutputHelper output;
        public CreateChoreCategoryTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task CreateChoreCategory_ShouldCreateForCurrentUser()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var handler = new CreateChoreCategoryHandler(context, new FakeCurrentUserService(userId), NullLogger<CreateChoreCategoryHandler>.Instance);
            var command = new CreateChoreCategoryCommand("Kitchen", "kitchen-icon");
            var result = await handler.Handle(command, CancellationToken.None);

            var category = await context.ChoreCategories.FirstAsync();
            Assert.Equal(result, category.Id);
            Assert.Equal(userId, category.UserId);
            Assert.Equal("Kitchen", category.Name);

            output.WriteLine("Chore category created successfully");
        }
    }
}
