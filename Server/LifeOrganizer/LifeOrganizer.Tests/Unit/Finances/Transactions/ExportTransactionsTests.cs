using LifeOrganizer.Application.Finances.Commands.Transactions.CreateTransaction;
using LifeOrganizer.Application.Finances.Commands.Transactions.ExportTransaction;
using LifeOrganizer.Application.Finances.Commands.Transactions.ExportTransactions;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.Extensions.Logging.Abstractions;
using System.Text;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.Transactions
{
    public class ExportTransactionsTests
    {
        private readonly ITestOutputHelper output;
        public ExportTransactionsTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task ExportTransactions_ShouldEscapeCommasAndQuotesInDescription()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var category = new TransactionCategory 
            { 
                Id = Guid.NewGuid(), 
                UserId = userId, 
                Name = "Food", 
                Type = TransactionType.Expense 
            };
            context.TransactionCategories.Add(category);

            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CategoryId = category.Id,
                Amount = 20,
                Type = TransactionType.Expense,
                Description = "Lunch, with \"quotes\"",
                Date = new DateOnly(2026, 7, 15)
            };      
            context.Transactions.Add(transaction);
            await context.SaveChangesAsync();

            var handler = new ExportTransactionsHandler(context, new FakeCurrentUserService(userId), NullLogger<ExportTransactionsHandler>.Instance);

            var result = await handler.Handle(new ExportTransactionsQuery(null, null), CancellationToken.None);
            var csv = Encoding.UTF8.GetString(result);

            Assert.Contains("\"Lunch, with \"\"quotes\"\"\"", csv);

            output.WriteLine("CSV correctly escaped special characters");
        }

        [Fact]
        public async Task ExportTransactions_ShouldOnlyIncludeCurrentUsersTransactions()
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
            context.TransactionCategories.Add(category);

            context.Transactions.AddRange(
                new Transaction { Id = Guid.NewGuid(), UserId = userId, CategoryId = category.Id, Amount = 10, Type = TransactionType.Expense, Date = new DateOnly(2026, 7, 1) },
                new Transaction { Id = Guid.NewGuid(), UserId = otherUserId, CategoryId = category.Id, Amount = 999, Type = TransactionType.Expense, Date = new DateOnly(2026, 7, 1) }
            );
            await context.SaveChangesAsync();

            var handler = new ExportTransactionsHandler(context, new FakeCurrentUserService(userId), NullLogger<ExportTransactionsHandler>.Instance);

            var result = await handler.Handle(new ExportTransactionsQuery(null, null), CancellationToken.None);
            var csv = Encoding.UTF8.GetString(result);

            Assert.DoesNotContain("999", csv);

            output.WriteLine("Export correctly excluded another user's transactions");
        }
    }
}
