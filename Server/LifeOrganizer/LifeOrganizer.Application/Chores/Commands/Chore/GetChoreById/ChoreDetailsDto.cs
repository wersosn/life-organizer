using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Application.Chores.Commands.Chore.GetChoreById
{
    public record ChoreDetailsDto(
        Guid Id,
        string Name,
        string? Description,
        Guid CategoryId,
        string CategoryName,
        ChoreFrequency FrequencyUnit,
        int FrequencyValue,
        DateTime? LastCompletedAt,
        bool IsAutomationEnabled,
        bool IsOverdue,
        List<ChoreCompletionDto> RecentCompletions
    );

    public record ChoreCompletionDto(Guid Id, DateTime CompletedAt, string? Notes);
}
