using LifeOrganizer.Domain.Enums;
using MediatR;

namespace LifeOrganizer.Application.Habits.Commands.UpdateHabit
{
    public record UpdateHabitCommand(Guid Id, string Name, HabitFrequency Frequency, List<DayOfWeek> ScheduledDays, TimeSpan? CompletionDeadline) : IRequest;
}
