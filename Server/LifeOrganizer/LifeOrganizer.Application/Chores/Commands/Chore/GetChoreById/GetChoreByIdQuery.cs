using MediatR;

namespace LifeOrganizer.Application.Chores.Commands.Chore.GetChoreById
{
    public record GetChoreByIdQuery(Guid Id) : IRequest<ChoreDetailsDto>;
}
