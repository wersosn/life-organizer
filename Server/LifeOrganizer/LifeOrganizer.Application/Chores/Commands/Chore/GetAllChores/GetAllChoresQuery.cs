using MediatR;

namespace LifeOrganizer.Application.Chores.Commands.Chore.GetAllChores
{
    public record GetAllChoresQuery : IRequest<List<ChoreDto>>;
}
