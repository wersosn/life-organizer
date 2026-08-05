using LifeOrganizer.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Infrastructure.Persistence.Configurations
{
    public class HabitConfiguration : IEntityTypeConfiguration<Habit>
    {
        public void Configure(EntityTypeBuilder<Habit> builder)
        {
            builder.HasKey(h => h.Id);
            builder.Property(h => h.Name).IsRequired().HasMaxLength(200);

            builder.Property(h => h.ScheduledDays)
                .HasColumnType("integer[]");

            builder.HasOne(h => h.User)
                .WithMany()
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(h => h.Completions)
                .WithOne(c => c.Habit)
                .HasForeignKey(c => c.HabitId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class HabitCompletionConfiguration : IEntityTypeConfiguration<HabitCompletion>
    {
        public void Configure(EntityTypeBuilder<HabitCompletion> builder)
        {
            builder.HasKey(c => c.Id);
            builder.HasIndex(c => new { c.HabitId, c.Date }).IsUnique();
        }
    }
}
