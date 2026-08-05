using MediatR;

namespace LifeOrganizer.Application.Chores.Commands.Chore.UncompleteChore
{
    public record UncompleteChoreCommand(Guid Id) : IRequest;
}
