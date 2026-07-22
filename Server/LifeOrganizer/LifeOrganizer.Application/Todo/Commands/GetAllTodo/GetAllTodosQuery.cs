using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Todo.Commands.GetAllTodo
{
    public record GetAllTodosQuery() : IRequest<List<TodoDto>>;
}
