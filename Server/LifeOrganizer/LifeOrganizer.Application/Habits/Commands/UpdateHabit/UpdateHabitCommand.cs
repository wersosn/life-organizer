using LifeOrganizer.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Habits.Commands.UpdateHabit
{
    public record UpdateHabitCommand(Guid Id, string Name, HabitFrequency Frequency, List<DayOfWeek> ScheduledDays, TimeSpan? CompletionDeadline) : IRequest;
}
