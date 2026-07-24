using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Todo.Commands.UpdateTodo
{
    public record UpdateTodoCommand(Guid Id, string Title, string? Description) : IRequest;
}
