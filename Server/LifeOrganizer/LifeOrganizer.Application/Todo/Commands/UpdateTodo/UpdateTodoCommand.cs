using MediatR;

namespace LifeOrganizer.Application.Todo.Commands.UpdateTodo
{
    public record UpdateTodoCommand(Guid Id, string Title, string? Description) : IRequest;
}
