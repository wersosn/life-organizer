using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Finances.Commands.Transactions.GetMonthlySummary;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Moq;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.Transactions
{
    public class GetMonthlySummaryTests
    {
        private readonly ITestOutputHelper output;

        public GetMonthlySummaryTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetMonthlySummary_ShouldCalculateTotalsAndCategoryBreakdown_ForGivenMonthOnly()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            var foodCategory = new TransactionCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Food", Type = TransactionType.Expense };
            var transportCategory = new TransactionCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Transport", Type = TransactionType.Expense };
            var salaryCategory = new TransactionCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Salary", Type = TransactionType.Income };

            context.TransactionCategories.AddRange(foodCategory, transportCategory, salaryCategory);

            context.Transactions.AddRange(
                // 07.2026 - should calculate
                new Transaction { Id = Guid.NewGuid(), UserId = userId, CategoryId = foodCategory.Id, Amount = 100, Type = TransactionType.Expense, Date = new DateOnly(2026, 7, 5) },
                new Transaction { Id = Guid.NewGuid(), UserId = userId, CategoryId = foodCategory.Id, Amount = 50, Type = TransactionType.Expense, Date = new DateOnly(2026, 7, 20) },
                new Transaction { Id = Guid.NewGuid(), UserId = userId, CategoryId = transportCategory.Id, Amount = 30, Type = TransactionType.Expense, Date = new DateOnly(2026, 7, 10) },
                new Transaction { Id = Guid.NewGuid(), UserId = userId, CategoryId = salaryCategory.Id, Amount = 3000, Type = TransactionType.Income, Date = new DateOnly(2026, 7, 1) },

                // 06.2026 - should not calculate
                new Transaction { Id = Guid.NewGuid(), UserId = userId, CategoryId = foodCategory.Id, Amount = 999, Type = TransactionType.Expense, Date = new DateOnly(2026, 6, 30) },

                // other user transaction - should not calculate
                new Transaction { Id = Guid.NewGuid(), UserId = otherUserId, CategoryId = foodCategory.Id, Amount = 500, Type = TransactionType.Expense, Date = new DateOnly(2026, 7, 12) }
            );
            await context.SaveChangesAsync();

            var handler = new GetMonthlySummaryHandler(context, new FakeCurrentUserService(userId), new FakeCacheService());

            var result = await handler.Handle(new GetMonthlySummaryQuery(2026, 7), CancellationToken.None);

            Assert.Equal(3000, result.TotalIncome);
            Assert.Equal(180, result.TotalExpense); // 100 + 50 + 30
            Assert.Equal(2820, result.Balance); // 3000 - 180

            Assert.Equal(2, result.ExpensesByCategory.Count);

            var foodBreakdown = result.ExpensesByCategory.First(c => c.CategoryId == foodCategory.Id);
            Assert.Equal(150, foodBreakdown.Total); // 100 + 50
            Assert.Equal(foodCategory.Id, result.ExpensesByCategory.First().CategoryId);

            var transportBreakdown = result.ExpensesByCategory.First(c => c.CategoryId == transportCategory.Id);
            Assert.Equal(30, transportBreakdown.Total);

            output.WriteLine("Monthly summary correctly calculated totals and category breakdown");
        }
    }
}
