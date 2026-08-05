using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Finances.Commands.Transactions.UpdateTransaction;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.Transactions
{
    public class UpdateTransactionTests
    {
        private readonly ITestOutputHelper output;
        public UpdateTransactionTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task UpdateTransaction_ShouldThrowNotFound_WhenCategoryDoesNotBelongToUser()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();
            var currentUser = new FakeCurrentUserService(userId);

            var category = new TransactionCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Food", Type = TransactionType.Expense };
            var foreignCategory = new TransactionCategory { Id = Guid.NewGuid(), UserId = otherUserId, Name = "Other's category", Type = TransactionType.Expense };
            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CategoryId = category.Id,
                Amount = 50,
                Type = TransactionType.Expense,
                Date = DateOnly.FromDateTime(DateTime.UtcNow)
            };
            context.TransactionCategories.AddRange(category, foreignCategory);
            context.Transactions.Add(transaction);
            await context.SaveChangesAsync();

            var handler = new UpdateTransactionHandler(context,currentUser);
            var command = new UpdateTransactionCommand(transaction.Id, foreignCategory.Id, 75, TransactionType.Expense, null, DateOnly.FromDateTime(DateTime.UtcNow));

            await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));

            output.WriteLine("Correctly rejected reassignment to another user's category");
        }
    }
}
