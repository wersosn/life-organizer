using MediatR;

namespace LifeOrganizer.Application.Todo.Commands.DeleteTodo
{
    public record DeleteTodoCommand(Guid Id) : IRequest;
}
