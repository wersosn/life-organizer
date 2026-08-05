namespace LifeOrganizer.Application.Chores.Commands.Chore.CompleChore
{
    public record CompleteChoreRequest(DateTime? CompletedAt, string? Notes);
}
