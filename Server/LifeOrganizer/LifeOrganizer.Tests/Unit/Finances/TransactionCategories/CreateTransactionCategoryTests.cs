using LifeOrganizer.Application.Finances.Commands.TransactionCategories.CreateTransactionCategory;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.TransactionCategories
{
    public class CreateTransactionCategoryTests
    {
        private readonly ITestOutputHelper output;

        public CreateTransactionCategoryTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task CreateTransactionCategory_ShouldCreateForCurrentUser()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var handler = new CreateTransactionCategoryHandler(context, new FakeCurrentUserService(userId), NullLogger<CreateTransactionCategoryHandler>.Instance);

            var command = new CreateTransactionCategoryCommand(Guid.NewGuid(), "Groceries", "cart-icon", TransactionType.Expense);

            var result = await handler.Handle(command, CancellationToken.None);

            var category = await context.TransactionCategories.FirstAsync();

            Assert.Equal(result, category.Id);
            Assert.Equal(userId, category.UserId);
            Assert.Equal("Groceries", category.Name);
            Assert.Equal("cart-icon", category.Icon);
            Assert.Equal(TransactionType.Expense, category.Type);

            output.WriteLine("Transaction category created successfully");
        }
    }
}
