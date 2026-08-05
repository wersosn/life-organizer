using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Chores.Commands.ChoreCategories.GetAllChoreCategories
{
    public class GetAllChoreCategoriesHandler : IRequestHandler<GetAllChoreCategoriesQuery, List<ChoreCategoryDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GetAllChoreCategoriesHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<List<ChoreCategoryDto>> Handle(GetAllChoreCategoriesQuery request, CancellationToken cancellationToken)
        {
            return await _context.ChoreCategories
                .Where(c => c.UserId == _currentUser.UserId)
                .OrderBy(c => c.Name)
                .Select(c => new ChoreCategoryDto(c.Id, c.Name, c.Icon))
                .ToListAsync(cancellationToken);
        }
    }
}
