using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Todo.Commands.UpdateTodo
{
    public class UpdateTodoHandler : IRequestHandler<UpdateTodoCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<UpdateTodoHandler> _logger;

        public UpdateTodoHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<UpdateTodoHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task Handle(UpdateTodoCommand request, CancellationToken cancellationToken)
        {
            var todo = await _context.TodoItems.FirstOrDefaultAsync(x => x.Id == request.Id && 
                    x.UserId == _currentUser.UserId,
                    cancellationToken);

            if (todo is null)
            {
                _logger.LogWarning("Todo item not found.");
                throw new NotFoundException(nameof(TodoItem), request.Id);
            }

            todo.Title = request.Title;
            todo.Description = request.Description;
            todo.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Todo item updated successfully. TodoId: {TodoId}", todo.Id);
        }
    }
}
