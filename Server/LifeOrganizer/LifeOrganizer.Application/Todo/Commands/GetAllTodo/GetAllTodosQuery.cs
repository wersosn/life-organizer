using MediatR;

namespace LifeOrganizer.Application.Todo.Commands.GetAllTodo
{
    public record GetAllTodosQuery() : IRequest<List<TodoDto>>;
}
