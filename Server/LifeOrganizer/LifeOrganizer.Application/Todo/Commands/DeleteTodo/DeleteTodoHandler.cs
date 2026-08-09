using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Todo.Commands.DeleteTodo
{
    public class DeleteTodoHandler : IRequestHandler<DeleteTodoCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<DeleteTodoHandler> _logger;

        public DeleteTodoHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<DeleteTodoHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task Handle(DeleteTodoCommand request, CancellationToken cancellationToken)
        {
            var todo = await _context.TodoItems.FirstOrDefaultAsync(x => x.Id == request.Id &&
                    x.UserId == _currentUser.UserId,
                    cancellationToken);

            if (todo is null)
            {
                _logger.LogWarning("Todo item not found.");
                throw new NotFoundException(nameof(TodoItem), request.Id);
            }

            _context.TodoItems.Remove(todo);
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Todo item deleted successfully. TodoId: {TodoId}", todo.Id);
        }
    }
}
