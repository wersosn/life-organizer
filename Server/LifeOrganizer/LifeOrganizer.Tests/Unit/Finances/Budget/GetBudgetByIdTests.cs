using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Finances.Commands.Budget.CreateBudget;
using LifeOrganizer.Application.Finances.Commands.Budget.GetBudgetById;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Finances.Budget
{
    public class GetBudgetByIdTests
    {
        private readonly ITestOutputHelper output;
        public GetBudgetByIdTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetBudgetById_ShouldThrowNotFound_WhenBudgetBelongsToDifferentUser()
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

            var budget = new LifeOrganizer.Domain.Entities.Budget 
            { 
                Id = Guid.NewGuid(), 
                UserId = ownerId, 
                CategoryId = category.Id, 
                MonthlyLimit = 500 
            };

            context.TransactionCategories.Add(category);
            context.Budgets.Add(budget);
            await context.SaveChangesAsync();

            var handler = new GetBudgetByIdHandler(context, new FakeCurrentUserService(otherUserId), NullLogger<GetBudgetByIdHandler>.Instance);
            await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(new GetBudgetByIdQuery(budget.Id), CancellationToken.None));

            output.WriteLine("Correctly hid existence of another user's budget");
        }
    }
}
