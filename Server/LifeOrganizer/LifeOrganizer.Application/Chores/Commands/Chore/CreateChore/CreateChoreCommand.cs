using LifeOrganizer.Domain.Enums;
using MediatR;

namespace LifeOrganizer.Application.Chores.Commands.Chore.CreateChore
{
    public record CreateChoreCommand(Guid Id, string Name, string? Description, Guid CategoryId, ChoreFrequency FrequencyUnit, int FrequencyValue) : IRequest<Guid>;
}
