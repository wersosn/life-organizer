using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Application.Habits.Commands.GetHabitById
{
    public record HabitDetailsDto
    (
        Guid Id,
        string Name,
        HabitFrequency Frequency,
        List<DayOfWeek> ScheduledDays,
        TimeSpan? CompletionDeadline,
        List<HabitCompletionDto> RecentCompletions
    );
    public record HabitCompletionDto(DateOnly Date, HabitCompletionStatus Status);
}
