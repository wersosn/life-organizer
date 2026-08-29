using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Finances.Commands.Budget.CreateBudget;
using LifeOrganizer.Application.Finances.Commands.Budget.DeleteBudget;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.Budget
{
    public class DeleteBudgetTests
    {
        private readonly ITestOutputHelper output;

        public DeleteBudgetTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task DeleteBudget_ShouldRemoveBudget()
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

            var budget = new LifeOrganizer.Domain.Entities.Budget
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CategoryId = category.Id,
                MonthlyLimit = 500
            };
            context.TransactionCategories.Add(category);
            context.Budgets.Add(budget);
            await context.SaveChangesAsync();

            var handler = new DeleteBudgetHandler(context, new FakeCurrentUserService(userId), new FakeCacheService(), NullLogger<DeleteBudgetHandler>.Instance);

            await handler.Handle(new DeleteBudgetCommand(budget.Id), CancellationToken.None);

            Assert.Empty(await context.Budgets.ToListAsync());

            output.WriteLine("Budget deleted successfully");
        }
    }
}
