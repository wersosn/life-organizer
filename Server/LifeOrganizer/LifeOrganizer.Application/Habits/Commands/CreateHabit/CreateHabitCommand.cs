using LifeOrganizer.Domain.Enums;
using MediatR;

namespace LifeOrganizer.Application.Habits.Commands.CreateHabit
{
    public record CreateHabitCommand(Guid Id, string Name, HabitFrequency Frequency, List<DayOfWeek> ScheduledDays, TimeSpan? CompletionDeadline) : IRequest<Guid>;
}
