using LifeOrganizer.Application.Common.Caching;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Finances.Commands.Budget.CreateBudget;
using LifeOrganizer.Application.Finances.Commands.Budget.DeleteBudget;
using LifeOrganizer.Application.Finances.Commands.Budget.GetBudgetWithUsage;
using LifeOrganizer.Application.Finances.Commands.Budget.UpdateBudget;
using LifeOrganizer.Application.Finances.Commands.Transactions.CreateTransaction;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Infrastructure.Caching;
using LifeOrganizer.Tests.Helpers;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Caching
{
    public class BudgetsCachingTests
    {
        private readonly ITestOutputHelper output;
        public BudgetsCachingTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetBudgetWithUsage_ShouldReturnCachedResult_EvenAfterUnderlyingDataChanges()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var category = new TransactionCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Food", Type = TransactionType.Expense };
            var budget = new Budget { Id = Guid.NewGuid(), UserId = userId, CategoryId = category.Id, MonthlyLimit = 500 };
            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CategoryId = category.Id,
                Amount = 100,
                Type = TransactionType.Expense,
                Date = new DateOnly(2026, 7, 10)
            };
            context.TransactionCategories.Add(category);
            context.Budgets.Add(budget);
            context.Transactions.Add(transaction);
            await context.SaveChangesAsync();

            var cacheService = new MemoryCacheService(new MemoryCache(new MemoryCacheOptions()));
            var handler = new GetBudgetWithUsageHandler(context, new FakeCurrentUserService(userId), cacheService);

            var firstResult = await handler.Handle(new GetBudgetWithUsageQuery(2026, 7), CancellationToken.None);
            Assert.Equal(100, firstResult.First().Spent);

            transaction.Amount = 999;
            await context.SaveChangesAsync();

            var secondResult = await handler.Handle(new GetBudgetWithUsageQuery(2026, 7), CancellationToken.None);
            Assert.Equal(100, secondResult.First().Spent);

            output.WriteLine("Second call correctly returned cached budget usage despite underlying data change");
        }

        [Fact]
        public async Task GetBudgetWithUsage_ShouldReturnFreshResult_AfterCreatingTransactionInvalidatesCache()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var category = new TransactionCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Food", Type = TransactionType.Expense };
            var budget = new Budget { Id = Guid.NewGuid(), UserId = userId, CategoryId = category.Id, MonthlyLimit = 500 };
            context.TransactionCategories.Add(category);
            context.Budgets.Add(budget);
            await context.SaveChangesAsync();

            var cacheService = new MemoryCacheService(new MemoryCache(new MemoryCacheOptions()));
            var budgetHandler = new GetBudgetWithUsageHandler(context, new FakeCurrentUserService(userId), cacheService);
            var createTransactionHandler = new CreateTransactionHandler(context, new FakeCurrentUserService(userId), cacheService, NullLogger<CreateTransactionHandler>.Instance);

            var beforeResult = await budgetHandler.Handle(new GetBudgetWithUsageQuery(2026, 7), CancellationToken.None);
            Assert.Equal(0, beforeResult.First().Spent);

            await createTransactionHandler.Handle(
                new CreateTransactionCommand(category.Id, 150, TransactionType.Expense, null, new DateOnly(2026, 7, 15)),
                CancellationToken.None);

            var afterResult = await budgetHandler.Handle(new GetBudgetWithUsageQuery(2026, 7), CancellationToken.None);
            Assert.Equal(150, afterResult.First().Spent);

            output.WriteLine("Budget usage cache correctly invalidated after creating a new transaction");
        }

        [Fact]
        public async Task CreateBudget_ShouldInvalidateUserCache()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var category = new TransactionCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Food", Type = TransactionType.Expense };
            context.TransactionCategories.Add(category);
            await context.SaveChangesAsync();

            var cacheServiceMock = new Mock<ICacheService>();
            var handler = new CreateBudgetHandler(context, new FakeCurrentUserService(userId), cacheServiceMock.Object, NullLogger<CreateBudgetHandler>.Instance);

            await handler.Handle(new CreateBudgetCommand(category.Id, 500), CancellationToken.None);

            cacheServiceMock.Verify(c => c.RemoveByPrefix(CacheKeys.UserPrefix(userId)), Times.Once);

            output.WriteLine($"CreateBudgetHandler correctly called RemoveByPrefix with key \"{CacheKeys.UserPrefix(userId)}\" exactly once after creating a budget");
        }

        [Fact]
        public async Task UpdateBudget_ShouldInvalidateUserCache()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var category = new TransactionCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Food", Type = TransactionType.Expense };
            var budget = new Budget { Id = Guid.NewGuid(), UserId = userId, CategoryId = category.Id, MonthlyLimit = 500 };
            context.TransactionCategories.Add(category);
            context.Budgets.Add(budget);
            await context.SaveChangesAsync();

            var cacheServiceMock = new Mock<ICacheService>();
            var handler = new UpdateBudgetHandler(context, new FakeCurrentUserService(userId), cacheServiceMock.Object, NullLogger<UpdateBudgetHandler>.Instance);

            await handler.Handle(new UpdateBudgetCommand(budget.Id, 750), CancellationToken.None);

            cacheServiceMock.Verify(c => c.RemoveByPrefix(CacheKeys.UserPrefix(userId)), Times.Once);

            output.WriteLine($"UpdateBudgetHandler correctly called RemoveByPrefix with key \"{CacheKeys.UserPrefix(userId)}\" exactly once after updating a budget");
        }

        [Fact]
        public async Task DeleteBudget_ShouldInvalidateUserCache()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var category = new TransactionCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Food", Type = TransactionType.Expense };
            var budget = new Budget { Id = Guid.NewGuid(), UserId = userId, CategoryId = category.Id, MonthlyLimit = 500 };
            context.TransactionCategories.Add(category);
            context.Budgets.Add(budget);
            await context.SaveChangesAsync();

            var cacheServiceMock = new Mock<ICacheService>();
            var handler = new DeleteBudgetHandler(context, new FakeCurrentUserService(userId), cacheServiceMock.Object, NullLogger<DeleteBudgetHandler>.Instance);

            await handler.Handle(new DeleteBudgetCommand(budget.Id), CancellationToken.None);

            cacheServiceMock.Verify(c => c.RemoveByPrefix(CacheKeys.UserPrefix(userId)), Times.Once);

            output.WriteLine($"DeleteBudgetHandler correctly called RemoveByPrefix with key \"{CacheKeys.UserPrefix(userId)}\" exactly once after deleting a budget");
        }
    }
}
