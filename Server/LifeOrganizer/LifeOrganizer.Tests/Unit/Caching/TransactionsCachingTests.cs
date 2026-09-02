using LifeOrganizer.Application.Common.Caching;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Finances.Commands.Transactions.CreateTransaction;
using LifeOrganizer.Application.Finances.Commands.Transactions.DeleteTransaction;
using LifeOrganizer.Application.Finances.Commands.Transactions.GetMonthlySummary;
using LifeOrganizer.Application.Finances.Commands.Transactions.UpdateTransaction;
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
    public class TransactionsCachingTests
    {
        private readonly ITestOutputHelper output;
        public TransactionsCachingTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetMonthlySummary_ShouldReturnCachedResult_EvenAfterUnderlyingDataChanges()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var category = new TransactionCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Food", Type = TransactionType.Expense };
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
            context.Transactions.Add(transaction);
            await context.SaveChangesAsync();

            var cacheService = new MemoryCacheService(new MemoryCache(new MemoryCacheOptions()));
            var handler = new GetMonthlySummaryHandler(context, new FakeCurrentUserService(userId), cacheService);

            var firstResult = await handler.Handle(new GetMonthlySummaryQuery(2026, 7), CancellationToken.None);
            Assert.Equal(100, firstResult.TotalExpense);

            transaction.Amount = 999;
            await context.SaveChangesAsync();

            var secondResult = await handler.Handle(new GetMonthlySummaryQuery(2026, 7), CancellationToken.None);

            Assert.Equal(100, secondResult.TotalExpense);

            output.WriteLine("Second call correctly returned cached result despite underlying data change");
        }

        [Fact]
        public async Task GetMonthlySummary_ShouldReturnFreshResult_AfterCacheIsInvalidated()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var category = new TransactionCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Food", Type = TransactionType.Expense };
            context.TransactionCategories.Add(category);
            await context.SaveChangesAsync();

            var cacheService = new MemoryCacheService(new MemoryCache(new MemoryCacheOptions()));
            var summaryHandler = new GetMonthlySummaryHandler(context, new FakeCurrentUserService(userId), cacheService);
            var createHandler = new CreateTransactionHandler(context, new FakeCurrentUserService(userId), cacheService, NullLogger<CreateTransactionHandler>.Instance);

            var beforeResult = await summaryHandler.Handle(new GetMonthlySummaryQuery(2026, 7), CancellationToken.None);
            Assert.Equal(0, beforeResult.TotalExpense);

            await createHandler.Handle(
                new CreateTransactionCommand(Guid.NewGuid(), category.Id, 150, TransactionType.Expense, null, new DateOnly(2026, 7, 15)),
                CancellationToken.None);

            var afterResult = await summaryHandler.Handle(new GetMonthlySummaryQuery(2026, 7), CancellationToken.None);

            Assert.Equal(150, afterResult.TotalExpense);

            output.WriteLine("Cache correctly invalidated after creating a new transaction");
        }

        [Fact]
        public async Task CreateTransaction_ShouldInvalidateUserCache()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var category = new TransactionCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Food", Type = TransactionType.Expense };
            context.TransactionCategories.Add(category);
            await context.SaveChangesAsync();

            var cacheServiceMock = new Mock<ICacheService>();
            var handler = new CreateTransactionHandler(context, new FakeCurrentUserService(userId), cacheServiceMock.Object, NullLogger<CreateTransactionHandler>.Instance);

            await handler.Handle(
                new CreateTransactionCommand(Guid.NewGuid(), category.Id, 50, TransactionType.Expense, null, new DateOnly(2026, 7, 1)),
                CancellationToken.None);

            cacheServiceMock.Verify(c => c.RemoveByPrefix(CacheKeys.UserPrefix(userId)), Times.Once);

            output.WriteLine($"CreateTransactionHandler correctly called RemoveByPrefix with key \"{CacheKeys.UserPrefix(userId)}\" exactly once after creating a transaction");
        }

        [Fact]
        public async Task UpdateTransaction_ShouldInvalidateUserCache()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var category = new TransactionCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Food", Type = TransactionType.Expense };
            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CategoryId = category.Id,
                Amount = 100,
                Type = TransactionType.Expense,
                Date = new DateOnly(2026, 7, 1)
            };
            context.TransactionCategories.Add(category);
            context.Transactions.Add(transaction);
            await context.SaveChangesAsync();

            var cacheServiceMock = new Mock<ICacheService>();
            var handler = new UpdateTransactionHandler(context, new FakeCurrentUserService(userId), cacheServiceMock.Object, NullLogger<UpdateTransactionHandler>.Instance);

            await handler.Handle(
                new UpdateTransactionCommand(transaction.Id, category.Id, 200, TransactionType.Expense, null, new DateOnly(2026, 7, 10)),
                CancellationToken.None);

            cacheServiceMock.Verify(c => c.RemoveByPrefix(CacheKeys.UserPrefix(userId)), Times.Once);

            output.WriteLine($"UpdateTransactionHandler correctly called RemoveByPrefix with key \"{CacheKeys.UserPrefix(userId)}\" exactly once after updating a transaction");
        }

        [Fact]
        public async Task DeleteTransaction_ShouldInvalidateUserCache()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var category = new TransactionCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Food", Type = TransactionType.Expense };
            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CategoryId = category.Id,
                Amount = 100,
                Type = TransactionType.Expense,
                Date = new DateOnly(2026, 7, 1)
            };
            context.TransactionCategories.Add(category);
            context.Transactions.Add(transaction);
            await context.SaveChangesAsync();

            var cacheServiceMock = new Mock<ICacheService>();
            var handler = new DeleteTransactionHandler(context, new FakeCurrentUserService(userId), cacheServiceMock.Object, NullLogger<DeleteTransactionHandler>.Instance);

            await handler.Handle(new DeleteTransactionCommand(transaction.Id), CancellationToken.None);

            cacheServiceMock.Verify(c => c.RemoveByPrefix(CacheKeys.UserPrefix(userId)), Times.Once);

            output.WriteLine($"DeleteTransactionHandler correctly called RemoveByPrefix with key \"{CacheKeys.UserPrefix(userId)}\" exactly once after deleting a transaction");
        }
    }
}
