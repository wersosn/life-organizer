using MediatR;

namespace LifeOrganizer.Application.Habits.Commands.GetHabitById
{
    public record GetHabitByIdQuery(Guid Id) : IRequest<HabitDetailsDto>;
}
