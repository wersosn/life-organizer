using MediatR;

namespace LifeOrganizer.Application.Habits.Commands.DeleteHabit
{
    public record DeleteHabitCommand(Guid Id) : IRequest;
}
