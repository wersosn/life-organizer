using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Domain.Entities
{
    public class Habit
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public HabitFrequency Frequency { get; set; }
        public List<DayOfWeek> ScheduledDays { get; set; } = new();
        public TimeSpan? CompletionDeadline { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<HabitCompletion> Completions { get; set; } = new List<HabitCompletion>();
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
