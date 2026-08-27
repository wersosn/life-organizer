using LifeOrganizer.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<User> Users { get; }
        DbSet<TodoItem> TodoItems { get; }
        DbSet<Habit> Habits { get; }
        DbSet<HabitCompletion> HabitCompletions { get; }
        DbSet<Transaction> Transactions { get; }
        DbSet<TransactionCategory> TransactionCategories { get; }
        DbSet<Budget> Budgets { get; }
        DbSet<Chore> Chores { get; }
        DbSet<ChoreCategory> ChoreCategories { get; }
        DbSet<ChoreCompletion> ChoreCompletions { get; }
        DbSet<RefreshToken> RefreshTokens { get; }
        DbSet<VerificationToken> VerificationTokens { get; }
        DbSet<IdempotentRequest> IdempotentRequests { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
