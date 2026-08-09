using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Todo.Commands.CreateTodo
{
    public class CreateTodoHandler : IRequestHandler<CreateTodoCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<CreateTodoHandler> _logger;

        public CreateTodoHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<CreateTodoHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task<Guid> Handle(CreateTodoCommand request, CancellationToken cancellationToken)
        {
            var todo = new TodoItem
            {
                Id = Guid.NewGuid(),
                UserId = _currentUser.UserId,
                Title = request.Title,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow
            };

            _context.TodoItems.Add(todo);
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Todo item created successfully. TodoId: {TodoId}", todo.Id);
            return todo.Id;
        }
    }
}
