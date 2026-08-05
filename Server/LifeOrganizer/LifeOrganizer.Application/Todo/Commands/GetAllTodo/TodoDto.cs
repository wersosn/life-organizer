namespace LifeOrganizer.Application.Todo.Commands.GetAllTodo
{
    public record TodoDto
    (
        Guid Id,
        string Title,
        string? Description,
        bool IsCompleted,
        DateTime CreatedAt,
        DateTime? CompletedAt
    );
}
