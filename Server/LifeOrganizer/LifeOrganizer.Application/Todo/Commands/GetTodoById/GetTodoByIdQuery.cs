using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Todo.Commands.GetTodoById
{
    public record GetTodoByIdQuery(Guid Id) : IRequest<TodoDetailsDto>;
}
