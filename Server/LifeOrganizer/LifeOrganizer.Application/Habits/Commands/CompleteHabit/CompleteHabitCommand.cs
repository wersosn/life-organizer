using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Habits.Commands.CompleteHabit
{
    public record CompleteHabitCommand(Guid Id, DateOnly? Date) : IRequest<Guid>;
}
