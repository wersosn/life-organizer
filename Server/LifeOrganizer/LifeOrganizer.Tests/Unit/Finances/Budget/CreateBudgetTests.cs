using FluentValidation;
using LifeOrganizer.Application.Finances.Commands.Budget.CreateBudget;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.Budget
{
    public class CreateBudgetTests
    {
        private readonly ITestOutputHelper output;
        public CreateBudgetTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task CreateBudget_ShouldThrowValidationException_WhenBudgetForCategoryAlreadyExists()
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
            context.Budgets.Add(new LifeOrganizer.Domain.Entities.Budget 
            { 
                Id = Guid.NewGuid(), 
                UserId = userId, 
                CategoryId = category.Id,
                MonthlyLimit = 500 
            });
            await context.SaveChangesAsync();

            var handler = new CreateBudgetHandler(context, new FakeCurrentUserService(userId));
            var command = new CreateBudgetCommand(category.Id, 800);
            await Assert.ThrowsAsync<ValidationException>(() => handler.Handle(command, CancellationToken.None));

            output.WriteLine("Correctly blocked duplicate budget for the same category");
        }
    }
}
