using MediatR;

namespace LifeOrganizer.Application.Habits.Commands.GetAllHabits
{
    public record GetAllHabitsQuery : IRequest<List<HabitDto>>;
}
