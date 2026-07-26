using LifeOrganizer.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
