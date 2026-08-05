using MediatR;

namespace LifeOrganizer.Application.Habits.Commands.CompleteHabit
{
    public record CompleteHabitCommand(Guid Id, DateOnly? Date) : IRequest<Guid>;
}
