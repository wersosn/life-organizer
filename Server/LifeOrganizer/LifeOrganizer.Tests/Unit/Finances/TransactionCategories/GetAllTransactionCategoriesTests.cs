using LifeOrganizer.Application.Finances.Commands.TransactionCategories.GetAllTransactionCategories;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.TransactionCategories
{
    public class GetAllTransactionCategoriesTests
    {
        private readonly ITestOutputHelper output;

        public GetAllTransactionCategoriesTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetAllTransactionCategories_ShouldReturnOnlyCurrentUserCategories()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            context.TransactionCategories.AddRange(
                new TransactionCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Food", Type = TransactionType.Expense },
                new TransactionCategory { Id = Guid.NewGuid(), UserId = otherUserId, Name = "Other user's category", Type = TransactionType.Expense }
            );
            await context.SaveChangesAsync();

            var handler = new GetAllTransactionCategoriesHandler(context, new FakeCurrentUserService(userId));

            var result = await handler.Handle(new GetAllTransactionCategoriesQuery(), CancellationToken.None);

            Assert.Single(result);
            Assert.Equal("Food", result.First().Name);

            output.WriteLine("Correctly returned only current user's categories");
        }
    }
}
