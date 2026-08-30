namespace LifeOrganizer.Application.Chores.Commands.Chore.CompleteChore
{
    public record CompleteChoreRequest(DateTime? CompletedAt, string? Notes);
}
