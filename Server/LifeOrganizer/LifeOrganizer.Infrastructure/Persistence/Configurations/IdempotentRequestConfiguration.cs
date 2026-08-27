using LifeOrganizer.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Infrastructure.Persistence.Configurations
{
    public class IdempotentRequestConfiguration : IEntityTypeConfiguration<IdempotentRequest>
    {
        public void Configure(EntityTypeBuilder<IdempotentRequest> builder)
        {
            builder
                .HasKey(r => r.Id);

            builder
                .Property(r => r.IdempotencyKey)
                .IsRequired()
                .HasMaxLength(100);

            builder
                .HasIndex(r => new { r.UserId, r.IdempotencyKey })
                .IsUnique();
        }
    }
}
