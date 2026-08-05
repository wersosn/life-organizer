using MediatR;

namespace LifeOrganizer.Application.Todo.Commands.CompleteTodo
{
    public record CompleteTodoCommand(Guid Id) : IRequest;
}
