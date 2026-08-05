using FluentValidation;
using LifeOrganizer.Application.Finances.Commands.TransactionCategories.UpdateTransactionCategory;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.TransactionCategories
{
    public class UpdateTransactionCategoryTests
    {
        private readonly ITestOutputHelper output;

        public UpdateTransactionCategoryTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task UpdateTransactionCategory_ShouldThrowValidationException_WhenChangingTypeWithExistingTransactions()
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

            var handler = new UpdateTransactionCategoryHandler(context, new FakeCurrentUserService(userId));
            var command = new UpdateTransactionCategoryCommand(category.Id, "Food", null, TransactionType.Income);

            await Assert.ThrowsAsync<ValidationException>(() => handler.Handle(command, CancellationToken.None));

            var unchanged = await context.TransactionCategories.FirstAsync();
            Assert.Equal(TransactionType.Expense, unchanged.Type);

            output.WriteLine("Correctly blocked type change on category with existing transactions");
        }

        [Fact]
        public async Task UpdateTransactionCategory_ShouldAllowTypeChange_WhenNoTransactionsExist()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var category = new TransactionCategory
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Freelance",
                Type = TransactionType.Expense
            };
            context.TransactionCategories.Add(category);
            await context.SaveChangesAsync();

            var handler = new UpdateTransactionCategoryHandler(context, new FakeCurrentUserService(userId));
            var command = new UpdateTransactionCategoryCommand(category.Id, "Freelance", null, TransactionType.Income);

            await handler.Handle(command, CancellationToken.None);

            var updated = await context.TransactionCategories.FirstAsync();
            Assert.Equal(TransactionType.Income, updated.Type);

            output.WriteLine("Type change allowed on category with no transactions");
        }
    }
}
