using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Chores.Commands.ChoreCategories.GetChoreCategoryById
{
    public class GetChoreCategoryByIdHandler : IRequestHandler<GetChoreCategoryByIdQuery, ChoreCategoryDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<GetChoreCategoryByIdHandler> _logger;

        public GetChoreCategoryByIdHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<GetChoreCategoryByIdHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task<ChoreCategoryDto> Handle(GetChoreCategoryByIdQuery request, CancellationToken cancellationToken)
        {
            var category = await _context.ChoreCategories
                .Where(c => c.Id == request.Id && c.UserId == _currentUser.UserId)
                .Select(c => new ChoreCategoryDto(c.Id, c.Name, c.Icon))
                .FirstOrDefaultAsync(cancellationToken);

            if (category is null)
            {
                _logger.LogWarning("Chore category not found.");
                throw new NotFoundException(nameof(ChoreCategory), request.Id);
            }
            return category;
        }
    }
}
