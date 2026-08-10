using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Application.Todo.Commands
{
    public record TodoDto
    (
        Guid Id,
        string Title,
        string? Description,
        bool IsCompleted,
        DateTime CreatedAt,
        DateTime? CompletedAt,
        TaskSource Source
    );
}
