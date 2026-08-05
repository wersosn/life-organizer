using LifeOrganizer.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Infrastructure.Persistence.Configurations
{
    public class HabitCompletionConfiguration : IEntityTypeConfiguration<HabitCompletion>
    {
        public void Configure(EntityTypeBuilder<HabitCompletion> builder)
        {
            builder.HasKey(c => c.Id);
            builder.HasIndex(c => new { c.HabitId, c.Date }).IsUnique();
        }
    }
}
