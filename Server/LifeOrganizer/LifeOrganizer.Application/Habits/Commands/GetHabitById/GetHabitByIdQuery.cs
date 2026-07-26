using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Habits.Commands.GetHabitById
{
    public record GetHabitByIdQuery(Guid Id) : IRequest<HabitDetailsDto>;
}
