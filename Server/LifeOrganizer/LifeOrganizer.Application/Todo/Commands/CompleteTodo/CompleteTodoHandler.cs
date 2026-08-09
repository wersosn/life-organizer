using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Todo.Commands.CompleteTodo
{
    public class CompleteTodoHandler : IRequestHandler<CompleteTodoCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<CompleteTodoHandler> _logger;

        public CompleteTodoHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<CompleteTodoHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task Handle(CompleteTodoCommand request, CancellationToken cancellationToken)
        {
            var todo = await _context.TodoItems.FirstOrDefaultAsync(x => x.Id == request.Id &&
                    x.UserId == _currentUser.UserId,
                    cancellationToken);

            if (todo is null)
            {
                _logger.LogWarning("Todo item not found.");
                throw new NotFoundException(nameof(TodoItem), request.Id);
            }

            todo.IsCompleted = !todo.IsCompleted;
            todo.CompletedAt = todo.IsCompleted ? DateTime.UtcNow : null;
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Todo item marked as {Status}. TodoId: {TodoId}", todo.IsCompleted ? "completed" : "incomplete", todo.Id);
        }
    }
}
