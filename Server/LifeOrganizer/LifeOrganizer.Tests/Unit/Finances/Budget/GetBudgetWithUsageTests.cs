using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Finances.Commands.Budget.GetBudgetWithUsage;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Moq;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.Budget
{
    public class GetBudgetWithUsageTests
    {
        private readonly ITestOutputHelper output;

        public GetBudgetWithUsageTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetBudgetsWithUsage_ShouldCalculateSpentRemainingAndExceededFlag()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();

            var foodCategory = new TransactionCategory 
            { 
                Id = Guid.NewGuid(), 
                UserId = userId, 
                Name = "Food", 
                Type = TransactionType.Expense 
            };

            var transportCategory = new TransactionCategory 
            { 
                Id = Guid.NewGuid(), 
                UserId = userId, 
                Name = "Transport", 
                Type = TransactionType.Expense 
            };

            context.TransactionCategories.AddRange(foodCategory, transportCategory);
            context.Budgets.AddRange(
                new LifeOrganizer.Domain.Entities.Budget { Id = Guid.NewGuid(), UserId = userId, CategoryId = foodCategory.Id, MonthlyLimit = 200 },
                new LifeOrganizer.Domain.Entities.Budget { Id = Guid.NewGuid(), UserId = userId, CategoryId = transportCategory.Id, MonthlyLimit = 100 }
            );

            context.Transactions.AddRange(
                // Food: 250 spend in July — 200 over budget
                new Transaction { Id = Guid.NewGuid(), UserId = userId, CategoryId = foodCategory.Id, Amount = 150, Type = TransactionType.Expense, Date = new DateOnly(2026, 7, 5) },
                new Transaction { Id = Guid.NewGuid(), UserId = userId, CategoryId = foodCategory.Id, Amount = 100, Type = TransactionType.Expense, Date = new DateOnly(2026, 7, 20) },
                // Food: transaction not in July - should not calculate
                new Transaction { Id = Guid.NewGuid(), UserId = userId, CategoryId = foodCategory.Id, Amount = 999, Type = TransactionType.Expense, Date = new DateOnly(2026, 6, 1) }
                // Transport: no transactions
            );
            await context.SaveChangesAsync();

            var handler = new GetBudgetWithUsageHandler(context, new FakeCurrentUserService(userId), new FakeCacheService());
            var result = await handler.Handle(new GetBudgetWithUsageQuery(2026, 7), CancellationToken.None);
            Assert.Equal(2, result.Count);

            var food = result.First(r => r.CategoryId == foodCategory.Id);
            Assert.Equal(250, food.Spent);
            Assert.Equal(-50, food.Remaining);
            Assert.True(food.IsExceeded);

            var transport = result.First(r => r.CategoryId == transportCategory.Id);
            Assert.Equal(0, transport.Spent);
            Assert.Equal(100, transport.Remaining);
            Assert.False(transport.IsExceeded);

            output.WriteLine("Budget usage correctly calculated for both exceeded and unused categories");
        }
    }
}
