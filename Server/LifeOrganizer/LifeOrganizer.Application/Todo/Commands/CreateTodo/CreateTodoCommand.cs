using MediatR;

namespace LifeOrganizer.Application.Todo.Commands.CreateTodo
{
    public record CreateTodoCommand(Guid Id, string Title, string? Description) : IRequest<Guid>;
}
