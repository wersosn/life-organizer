using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Finances.Commands.TransactionCategories.GetTransactionCategoryById;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.TransactionCategories
{
    public class GetTransactionCategoryByIdTests
    {
        private readonly ITestOutputHelper output;

        public GetTransactionCategoryByIdTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetTransactionCategoryById_ShouldThrowNotFound_WhenCategoryBelongsToDifferentUser()
        {
            var context = TestDbContextFactory.Create();
            var ownerId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            var category = new TransactionCategory 
            { 
                Id = Guid.NewGuid(), 
                UserId = ownerId, 
                Name = "Food", 
                Type = TransactionType.Expense 
            };
            context.TransactionCategories.Add(category);
            await context.SaveChangesAsync();

            var handler = new GetTransactionCategoryByIdHandler(context, new FakeCurrentUserService(otherUserId));

            await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(new GetTransactionCategoryByIdQuery(category.Id), CancellationToken.None));

            output.WriteLine("Correctly hid existence of another user's category");
        }
    }
}
