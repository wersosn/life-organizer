using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Domain.Entities
{
    public class VerificationToken
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        public string Token { get; set; } = string.Empty;
        public VerificationTokenType Type { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UsedAt { get; set; }
        public bool IsActive => UsedAt is null && ExpiresAt > DateTime.UtcNow;
    }
}
