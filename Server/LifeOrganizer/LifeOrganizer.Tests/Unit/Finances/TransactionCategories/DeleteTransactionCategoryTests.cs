using FluentValidation;
using LifeOrganizer.Application.Finances.Commands.TransactionCategories.DeleteTransactionCategory;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.TransactionCategories
{
    public class DeleteTransactionCategoryTests
    {
        private readonly ITestOutputHelper output;

        public DeleteTransactionCategoryTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task DeleteTransactionCategory_ShouldThrowValidationException_WhenCategoryHasTransactions()
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
                Date = DateOnly.FromDateTime(DateTime.UtcNow)
            };
            context.Transactions.Add(transaction);
            await context.SaveChangesAsync();

            var handler = new DeleteTransactionCategoryHandler(context, new FakeCurrentUserService(userId));

            await Assert.ThrowsAsync<ValidationException>(() => handler.Handle(new DeleteTransactionCategoryCommand(category.Id), CancellationToken.None));

            Assert.Equal(1, await context.TransactionCategories.CountAsync());

            output.WriteLine("Correctly blocked deletion of category with existing transactions");
        }
    }
}
