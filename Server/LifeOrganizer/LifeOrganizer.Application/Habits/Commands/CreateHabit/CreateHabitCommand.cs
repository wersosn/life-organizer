using LifeOrganizer.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Habits.Commands.CreateHabit
{
    public record CreateHabitCommand(string Name, HabitFrequency Frequency, List<DayOfWeek> ScheduledDays, TimeSpan? CompletionDeadline) : IRequest<Guid>;
}
