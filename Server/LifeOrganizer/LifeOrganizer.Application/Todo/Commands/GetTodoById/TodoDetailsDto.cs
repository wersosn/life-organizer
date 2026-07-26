using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
