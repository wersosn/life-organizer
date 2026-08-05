using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Domain.Entities
{
    public class HabitCompletion
    {
        public Guid Id { get; set; }
        public Guid HabitId { get; set; }
        public Habit Habit { get; set; } = null!;
        public DateOnly Date { get; set; }
        public HabitCompletionStatus Status { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
