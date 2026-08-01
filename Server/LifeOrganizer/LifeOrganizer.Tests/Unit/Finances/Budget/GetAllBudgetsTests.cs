using LifeOrganizer.Application.Finances.Commands.Budget.GetAllBudgets;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.Budget
{
    public class GetAllBudgetsTests
    {
        private readonly ITestOutputHelper output;
        public GetAllBudgetsTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetAllBudgets_ShouldReturnOnlyCurrentUserBudgets()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            var category = new TransactionCategory 
            { 
                Id = Guid.NewGuid(), 
                UserId = userId, 
                Name = "Food", 
                Type = TransactionType.Expense 
            };
            var otherCategory = new TransactionCategory 
            { 
                Id = Guid.NewGuid(), 
                UserId = otherUserId, 
                Name = "Other", 
                Type = TransactionType.Expense 
            };

            context.TransactionCategories.AddRange(category, otherCategory);
            context.Budgets.AddRange(
                new LifeOrganizer.Domain.Entities.Budget { Id = Guid.NewGuid(), UserId = userId, CategoryId = category.Id, MonthlyLimit = 500 },
                new LifeOrganizer.Domain.Entities.Budget { Id = Guid.NewGuid(), UserId = otherUserId, CategoryId = otherCategory.Id, MonthlyLimit = 300 }
            );
            await context.SaveChangesAsync();

            var handler = new GetAllBudgetsHandler(context, new FakeCurrentUserService(userId));
            var result = await handler.Handle(new GetAllBudgetsQuery(), CancellationToken.None);

            Assert.Single(result);
            Assert.Equal(500, result.First().MonthlyLimit);

            output.WriteLine("Correctly returned only current user's budgets");
        }
    }
}
