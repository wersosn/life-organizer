using LifeOrganizer.Application.Finances.Commands.Transactions.GetAllTransactions;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.Transactions
{
    public class GetAllTransactionsTests
    {
        private readonly ITestOutputHelper output;
        public GetAllTransactionsTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetAllTransactions_ShouldReturnOnlyCurrentUserTransactionsWithinDateRange()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();
            var currentUser = new FakeCurrentUserService(userId);

            var category = new TransactionCategory 
            { 
                Id = Guid.NewGuid(), 
                UserId = userId, 
                Name = "Food", 
                Type = TransactionType.Expense 
            };
            context.TransactionCategories.Add(category);

            context.Transactions.AddRange(
                new Transaction { Id = Guid.NewGuid(), UserId = userId, CategoryId = category.Id, Amount = 10, Type = TransactionType.Expense, Date = new DateOnly(2026, 7, 15) },
                new Transaction { Id = Guid.NewGuid(), UserId = userId, CategoryId = category.Id, Amount = 20, Type = TransactionType.Expense, Date = new DateOnly(2026, 6, 1) },
                new Transaction { Id = Guid.NewGuid(), UserId = otherUserId, CategoryId = category.Id, Amount = 30, Type = TransactionType.Expense, Date = new DateOnly(2026, 7, 10) }
            );
            await context.SaveChangesAsync();

            var handler = new GetAllTransactionsHandler(context, currentUser);
            var result = await handler.Handle(
                new GetAllTransactionsQuery(new DateOnly(2026, 7, 1), new DateOnly(2026, 7, 31)),
                CancellationToken.None
            );

            Assert.Single(result);
            Assert.Equal(10, result.First().Amount);

            output.WriteLine("Correctly filtered transactions by user and date range");
        }
    }
}
