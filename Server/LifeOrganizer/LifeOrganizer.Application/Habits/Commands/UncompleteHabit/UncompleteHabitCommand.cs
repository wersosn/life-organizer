using MediatR;

namespace LifeOrganizer.Application.Habits.Commands.UncompleteHabit
{
    public record UncompleteHabitCommand(Guid Id, DateOnly? Date) : IRequest;
}
