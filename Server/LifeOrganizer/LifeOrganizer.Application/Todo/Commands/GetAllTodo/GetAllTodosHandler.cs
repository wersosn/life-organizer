using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Todo.Commands.GetAllTodo
{
    public class GetAllTodosHandler : IRequestHandler<GetAllTodosQuery, List<TodoDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GetAllTodosHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<List<TodoDto>> Handle(GetAllTodosQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            return await _context.TodoItems
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new TodoDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Description = x.Description,
                    IsCompleted = x.IsCompleted,
                    CreatedAt = x.CreatedAt,
                    CompletedAt = x.CompletedAt
                })
                .ToListAsync(cancellationToken);
        }
    }
}
