using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Domain.Entities
{
    public class Chore
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid CategoryId { get; set; }
        public ChoreCategory Category { get; set; } = null!;
        public ChoreFrequency FrequencyUnit { get; set; }
        public int FrequencyValue { get; set; }
        public DateTime? LastCompletedAt { get; set; }
        public bool IsAutomationEnabled { get; set; } = true;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<ChoreCompletion> Completions { get; set; } = new List<ChoreCompletion>();
    }
}
