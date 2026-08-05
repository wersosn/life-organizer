using MediatR;

namespace LifeOrganizer.Application.Todo.Commands.CreateTodo
{
    public record CreateTodoCommand(string Title, string? Description) : IRequest<Guid>;
}
