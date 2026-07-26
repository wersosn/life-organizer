using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Todo.Commands.GetTodoById
{
    public class GetTodoByIdHandler : IRequestHandler<GetTodoByIdQuery, TodoDetailsDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GetTodoByIdHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<TodoDetailsDto> Handle(GetTodoByIdQuery request, CancellationToken cancellationToken)
        {
            var todo = await _context.TodoItems.FirstOrDefaultAsync(x => x.Id == request.Id && x.UserId == _currentUser.UserId, cancellationToken);

            if (todo is null)
            {
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
