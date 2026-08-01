using LifeOrganizer.Application.Common.Events;
using LifeOrganizer.Application.Finances.EventHandlers;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.TransactionCategories
{
    public class SeedDefaultCategoriesTests
    {
        private readonly ITestOutputHelper output;
        public SeedDefaultCategoriesTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task SeedDefaultCategoriesOnUserRegistered_ShouldCreateDefaultCategories()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var handler = new SeedDefaultCategoriesOnUserRegistered(context);

            await handler.Handle(new UserRegisteredEvent(userId), CancellationToken.None);

            var categories = await context.TransactionCategories.Where(c => c.UserId == userId).ToListAsync();

            Assert.NotEmpty(categories);
            Assert.Contains(categories, c => c.Name == "Food" && c.Type == TransactionType.Expense);
            Assert.Contains(categories, c => c.Name == "Salary" && c.Type == TransactionType.Income);

            output.WriteLine($"Created {categories.Count} default categories for new user");
        }
    }
}
