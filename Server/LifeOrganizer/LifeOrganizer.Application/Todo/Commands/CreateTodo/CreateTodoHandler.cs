using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Todo.Commands.CreateTodo
{
    public class CreateTodoHandler : IRequestHandler<CreateTodoCommand, Guid>
    {
        private readonly IApplicationDbContext _context;

        public CreateTodoHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> Handle(CreateTodoCommand request, CancellationToken cancellationToken)
        {
            var todo = new TodoItem
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                Title = request.Title,
                Description = request.Description
            };

            _context.TodoItems.Add(todo);
            await _context.SaveChangesAsync(cancellationToken);
            return todo.Id;
        }
    }
}
