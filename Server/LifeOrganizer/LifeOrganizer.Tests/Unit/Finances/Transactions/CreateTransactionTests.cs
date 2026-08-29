using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Finances.Commands.TransactionCategories.UpdateTransactionCategory;
using LifeOrganizer.Application.Finances.Commands.Transactions.CreateTransaction;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.Transactions
{
    public class CreateTransactionTests
    {
        private readonly ITestOutputHelper output;
        public CreateTransactionTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task CreateTransaction_ShouldCreateForCurrentUser()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var currentUser = new FakeCurrentUserService(userId);

            var category = new TransactionCategory
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Food",
                Type = TransactionType.Expense
            };
            context.TransactionCategories.Add(category);
            await context.SaveChangesAsync();

            var handler = new CreateTransactionHandler(context, currentUser, new FakeCacheService(), NullLogger<CreateTransactionHandler>.Instance);
            var command = new CreateTransactionCommand(
                category.Id,
                49.99m,
                TransactionType.Expense,
                "Groceries",
                DateOnly.FromDateTime(DateTime.UtcNow)
            );

            var result = await handler.Handle(command, CancellationToken.None);

            var transaction = await context.Transactions.FirstAsync();
            Assert.Equal(result, transaction.Id);
            Assert.Equal(userId, transaction.UserId);
            Assert.Equal(49.99m, transaction.Amount);
            Assert.Equal("Groceries", transaction.Description);

            output.WriteLine("Transaction created successfully");
        }
    }
}
