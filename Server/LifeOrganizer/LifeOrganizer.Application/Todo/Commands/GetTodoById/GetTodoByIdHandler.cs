using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Todo.Commands.GetTodoById
{
    public class GetTodoByIdHandler : IRequestHandler<GetTodoByIdQuery, TodoDetailsDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<GetTodoByIdHandler> _logger;

        public GetTodoByIdHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<GetTodoByIdHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task<TodoDetailsDto> Handle(GetTodoByIdQuery request, CancellationToken cancellationToken)
        {
            var todo = await _context.TodoItems.FirstOrDefaultAsync(x => x.Id == request.Id && x.UserId == _currentUser.UserId, cancellationToken);

            if (todo is null)
            {
                _logger.LogWarning("Todo item not found.");
                throw new NotFoundException(nameof(todo), request.Id);
            }

            return new TodoDetailsDto(
                todo.Id,
                todo.Title,
                todo.Description,
                todo.IsCompleted,
                todo.CreatedAt,
                todo.CompletedAt
            );
        }
    }
}
