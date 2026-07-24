using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Todo.Commands.CreateTodo
{
    public record CreateTodoCommand(string Title, string? Description) : IRequest<Guid>;
}
