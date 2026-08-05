using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Domain.Entities
{
    public class TransactionCategory
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public string? Icon { get; set; }
        public TransactionType Type { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
