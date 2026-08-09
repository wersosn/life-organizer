using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Application.Habits.Commands
{
    public record HabitDto
    (
        Guid Id,
        string Name,
        HabitFrequency Frequency,
        List<DayOfWeek> ScheduledDays,
        TimeSpan? CompletionDeadline,
        bool IsActive,
        DateTime CreatedAt,
        bool IsAutomationEnabled,
        bool IsCompletedToday
    );
}
