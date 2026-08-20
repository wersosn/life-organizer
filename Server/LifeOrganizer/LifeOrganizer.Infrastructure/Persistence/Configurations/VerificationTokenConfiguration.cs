using LifeOrganizer.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Infrastructure.Persistence.Configurations
{
    public class VerificationTokenConfiguration : IEntityTypeConfiguration<VerificationToken>
    {
        public void Configure(EntityTypeBuilder<VerificationToken> builder)
        {
            builder
                .HasKey(t => t.Id);

            builder
                .Property(t => t.Token)
                .IsRequired()
                .HasMaxLength(64);

            builder
                .HasIndex(t => t.Token)
                .IsUnique();

            builder
                .HasIndex(t => new { t.UserId, t.Type });

            builder.HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
