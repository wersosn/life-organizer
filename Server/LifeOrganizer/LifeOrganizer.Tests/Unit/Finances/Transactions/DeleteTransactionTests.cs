using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Finances.Commands.Transactions.CreateTransaction;
using LifeOrganizer.Application.Finances.Commands.Transactions.DeleteTransaction;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.Transactions
{
    public class DeleteTransactionTests
    {
        private readonly ITestOutputHelper output;
        public DeleteTransactionTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task DeleteTransaction_ShouldRemoveTransaction()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var currentUser = new FakeCurrentUserService(userId);

            var category = new TransactionCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Food", Type = TransactionType.Expense };
            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CategoryId = category.Id,
                Amount = 20,
                Type = TransactionType.Expense,
                Date = DateOnly.FromDateTime(DateTime.UtcNow)
            };
            context.TransactionCategories.Add(category);
            context.Transactions.Add(transaction);
            await context.SaveChangesAsync();

            var handler = new DeleteTransactionHandler(context, currentUser, new FakeCacheService(), NullLogger<DeleteTransactionHandler>.Instance);

            await handler.Handle(new DeleteTransactionCommand(transaction.Id), CancellationToken.None);

            Assert.Empty(await context.Transactions.ToListAsync());

            output.WriteLine("Transaction deleted successfully");
        }
    }
}
