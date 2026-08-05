namespace LifeOrganizer.Application.Todo.Commands.GetTodoById
{
    public record TodoDetailsDto
    (
        Guid Id,
        string Title,
        string? Description,
        bool IsCompleted,
        DateTime CreatedAt,
        DateTime? CompletedAt
    );
}
