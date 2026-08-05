using LifeOrganizer.Domain.Enums;
using MediatR;

namespace LifeOrganizer.Application.Chores.Commands.Chore.UpdateChore
{
    public record UpdateChoreCommand(
        Guid Id,
        string Name,
        string? Description,
        Guid CategoryId,
        ChoreFrequency FrequencyUnit,
        int FrequencyValue,
        bool IsAutomationEnabled
    ) : IRequest;
}
