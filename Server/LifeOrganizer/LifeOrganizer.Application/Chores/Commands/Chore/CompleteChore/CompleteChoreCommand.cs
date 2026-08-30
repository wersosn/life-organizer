using MediatR;

namespace LifeOrganizer.Application.Chores.Commands.Chore.CompleteChore
{
    public record CompleteChoreCommand(Guid ChoreId, DateTime? CompletedAt, string? Notes) : IRequest<Guid>;
}
