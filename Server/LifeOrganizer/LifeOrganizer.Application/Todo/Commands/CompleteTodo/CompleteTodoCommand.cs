using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Todo.Commands.CompleteTodo
{
    public record CompleteTodoCommand(Guid Id) : IRequest;
}
