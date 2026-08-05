using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Chores.Commands.ChoreCategories.GetChoreCategoryById
{
    public class GetChoreCategoryByIdHandler : IRequestHandler<GetChoreCategoryByIdQuery, ChoreCategoryDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GetChoreCategoryByIdHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<ChoreCategoryDto> Handle(GetChoreCategoryByIdQuery request, CancellationToken cancellationToken)
        {
            var category = await _context.ChoreCategories
                .Where(c => c.Id == request.Id && c.UserId == _currentUser.UserId)
                .Select(c => new ChoreCategoryDto(c.Id, c.Name, c.Icon))
                .FirstOrDefaultAsync(cancellationToken);

            if (category is null)
            {
                throw new NotFoundException(nameof(ChoreCategory), request.Id);
            }
            return category;
        }
    }
}
