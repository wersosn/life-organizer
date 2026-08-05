using LifeOrganizer.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Infrastructure.Persistence.Configurations
{
    public class ChoreCompletionConfiguration : IEntityTypeConfiguration<ChoreCompletion>
    {
        public void Configure(EntityTypeBuilder<ChoreCompletion> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Notes)
                .HasMaxLength(500);

            builder.Property(c => c.CompletedAt)
                .IsRequired();

            builder.HasIndex(c => new { c.ChoreId, c.CompletedAt });
        }
    }
}
