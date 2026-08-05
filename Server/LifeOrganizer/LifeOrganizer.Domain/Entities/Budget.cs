namespace LifeOrganizer.Domain.Entities
{
    public class Budget
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        public Guid CategoryId { get; set; }
        public TransactionCategory Category { get; set; } = null!;
        public decimal MonthlyLimit { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
