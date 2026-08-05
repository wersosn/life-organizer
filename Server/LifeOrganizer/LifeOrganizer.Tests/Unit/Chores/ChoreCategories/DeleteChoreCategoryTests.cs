using FluentValidation;
using LifeOrganizer.Application.Chores.Commands.ChoreCategories.DeleteChoreCategory;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Chores.ChoreCategories
{
    public class DeleteChoreCategoryTests
    {
        private readonly ITestOutputHelper output;
        public DeleteChoreCategoryTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task DeleteChoreCategory_ShouldThrowValidationException_WhenCategoryHasChores()
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
                IsActive = true
            };

            context.Chores.Add(chore);
            await context.SaveChangesAsync();

            var handler = new DeleteChoreCategoryHandler(context, new FakeCurrentUserService(userId));
            await Assert.ThrowsAsync<ValidationException>(() => handler.Handle(new DeleteChoreCategoryCommand(category.Id), CancellationToken.None));
            Assert.Equal(1, await context.ChoreCategories.CountAsync());

            output.WriteLine("Correctly blocked deletion of category with existing chores");
        }

        [Fact]
        public async Task DeleteChoreCategory_ShouldSucceed_WhenCategoryHasNoChores()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();

            var category = new ChoreCategory 
            { 
                Id = Guid.NewGuid(), 
                UserId = userId, 
                Name = "Unused category" 
            };
            context.ChoreCategories.Add(category);
            await context.SaveChangesAsync();

            var handler = new DeleteChoreCategoryHandler(context, new FakeCurrentUserService(userId));
            await handler.Handle(new DeleteChoreCategoryCommand(category.Id), CancellationToken.None);
            Assert.Empty(await context.ChoreCategories.ToListAsync());

            output.WriteLine("Chore category deleted successfully when unused");
        }

    }
}
