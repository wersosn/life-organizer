namespace LifeOrganizer.Domain.Entities
{
    public class ChoreCompletion
    {
        public Guid Id { get; set; }
        public Guid ChoreId { get; set; }
        public Chore Chore { get; set; } = null!;
        public DateTime CompletedAt { get; set; }
        public string? Notes { get; set; }
    }
}
