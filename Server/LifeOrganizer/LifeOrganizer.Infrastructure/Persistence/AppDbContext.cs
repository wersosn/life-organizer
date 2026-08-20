using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Infrastructure.Persistence
{
    public class AppDbContext : DbContext, IApplicationDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users => Set<User>();
        public DbSet<TodoItem> TodoItems => Set<TodoItem>();
        public DbSet<Habit> Habits => Set<Habit>();
        public DbSet<HabitCompletion> HabitCompletions => Set<HabitCompletion>();
        public DbSet<Transaction> Transactions => Set<Transaction>();
        public DbSet<TransactionCategory> TransactionCategories => Set<TransactionCategory>();
        public DbSet<Budget> Budgets => Set<Budget>();
        public DbSet<Chore> Chores => Set<Chore>();
        public DbSet<ChoreCategory> ChoreCategories => Set<ChoreCategory>();
        public DbSet<ChoreCompletion> ChoreCompletions => Set<ChoreCompletion>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<VerificationToken> VerificationTokens => Set<VerificationToken>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
            base.OnModelCreating(modelBuilder);
        }
    }
}
