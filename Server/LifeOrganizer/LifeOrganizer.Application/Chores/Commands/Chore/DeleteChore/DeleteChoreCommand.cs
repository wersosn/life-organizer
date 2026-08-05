using MediatR;

namespace LifeOrganizer.Application.Chores.Commands.Chore.DeleteChore
{
    public record DeleteChoreCommand(Guid Id) : IRequest;
}
