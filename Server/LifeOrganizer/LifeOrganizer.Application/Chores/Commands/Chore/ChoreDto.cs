using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Application.Chores.Commands.Chore
{
    public record ChoreDto(
        Guid Id,
        string Name,
        string? Description,
        Guid CategoryId,
        string CategoryName,
        ChoreFrequency FrequencyUnit,
        int FrequencyValue,
        DateTime? LastCompletedAt,
        bool IsAutomationEnabled,
        bool IsOverdue
    );
}
