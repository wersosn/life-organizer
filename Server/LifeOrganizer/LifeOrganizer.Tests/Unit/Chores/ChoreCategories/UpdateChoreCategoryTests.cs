using LifeOrganizer.Application.Chores.Commands.ChoreCategories.UpdateChoreCategory;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Chores.ChoreCategories
{
    public class UpdateChoreCategoryTests
    {
        private readonly ITestOutputHelper output;
        public UpdateChoreCategoryTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task UpdateChoreCategory_ShouldUpdateNameAndIcon()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var category = new ChoreCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Kitchen", Icon = "old-icon" };
            context.ChoreCategories.Add(category);
            await context.SaveChangesAsync();

            var handler = new UpdateChoreCategoryHandler(context, new FakeCurrentUserService(userId));
            var command = new UpdateChoreCategoryCommand(category.Id, "Kitchen & Dining", "new-icon");

            await handler.Handle(command, CancellationToken.None);

            var updated = await context.ChoreCategories.FirstAsync();
            Assert.Equal("Kitchen & Dining", updated.Name);
            Assert.Equal("new-icon", updated.Icon);

            output.WriteLine("Chore category updated successfully");
        }
    }
}
