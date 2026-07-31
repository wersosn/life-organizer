using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Finances.Commands.TransactionCategories.GetAllTransactionCategories
{
    public class GetAllTransactionCategoriesHandler : IRequestHandler<GetAllTransactionCategoriesQuery, List<TransactionCategoryDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GetAllTransactionCategoriesHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<List<TransactionCategoryDto>> Handle(GetAllTransactionCategoriesQuery request, CancellationToken cancellationToken)
        {
            return await _context.TransactionCategories
                .Where(c => c.UserId == _currentUser.UserId)
                .OrderBy(c => c.Name)
                .Select(c => new TransactionCategoryDto(c.Id, c.Name, c.Icon, c.Type))
                .ToListAsync(cancellationToken);
        }
    }
}
