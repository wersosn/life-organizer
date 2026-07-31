using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Finances.Commands.Transactions.GetTransactionById;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.Transactions
{
    public class GetTransactionByIdTests
    {
        private readonly ITestOutputHelper output;
        public GetTransactionByIdTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetTransactionById_ShouldThrowNotFound_WhenTransactionBelongsToDifferentUser()
        {
            var context = TestDbContextFactory.Create();
            var ownerId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();
            var otherUser = new FakeCurrentUserService(otherUserId);

            var category = new TransactionCategory 
            { 
                Id = Guid.NewGuid(), 
                UserId = ownerId, 
                Name = "Food", 
                Type = TransactionType.Expense 
            };

            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = ownerId,
                CategoryId = category.Id,
                Amount = 15,
                Type = TransactionType.Expense,
                Date = DateOnly.FromDateTime(DateTime.UtcNow)
            };
            context.TransactionCategories.Add(category);
            context.Transactions.Add(transaction);
            await context.SaveChangesAsync();

            var handler = new GetTransactionByIdHandler(context, otherUser);

            await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(new GetTransactionByIdQuery(transaction.Id), CancellationToken.None));

            output.WriteLine("Correctly hid existence of another user's transaction");
        }
    }
}
