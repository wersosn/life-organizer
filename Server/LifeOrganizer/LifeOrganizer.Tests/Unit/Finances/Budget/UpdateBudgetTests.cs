using LifeOrganizer.Application.Finances.Commands.Budget.CreateBudget;
using LifeOrganizer.Application.Finances.Commands.Budget.UpdateBudget;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.Budget
{
    public class UpdateBudgetTests
    {
        private readonly ITestOutputHelper output;
        public UpdateBudgetTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task UpdateBudget_ShouldUpdateMonthlyLimit()
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

            var handler = new UpdateBudgetHandler(context, new FakeCurrentUserService(userId), NullLogger<UpdateBudgetHandler>.Instance);
            var command = new UpdateBudgetCommand(budget.Id, 750);
            await handler.Handle(command, CancellationToken.None);

            var updated = await context.Budgets.FirstAsync();
            Assert.Equal(750, updated.MonthlyLimit);

            output.WriteLine("Budget limit updated successfully");
        }
    }
}
