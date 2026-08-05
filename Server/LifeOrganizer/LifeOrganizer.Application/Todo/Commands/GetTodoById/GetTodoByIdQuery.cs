using MediatR;

namespace LifeOrganizer.Application.Todo.Commands.GetTodoById
{
    public record GetTodoByIdQuery(Guid Id) : IRequest<TodoDetailsDto>;
}
