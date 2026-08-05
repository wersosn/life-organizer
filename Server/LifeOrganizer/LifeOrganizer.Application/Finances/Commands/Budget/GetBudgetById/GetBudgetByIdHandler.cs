using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Finances.Commands.Budget.GetBudgetById
{
    public class GetBudgetByIdHandler : IRequestHandler<GetBudgetByIdQuery, BudgetDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GetBudgetByIdHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<BudgetDto> Handle(GetBudgetByIdQuery request, CancellationToken cancellationToken)
        {
            var budget = await _context.Budgets
                .Where(b => b.Id == request.Id && b.UserId == _currentUser.UserId)
                .Select(b => new BudgetDto(b.Id, b.CategoryId, b.Category.Name, b.MonthlyLimit))
                .FirstOrDefaultAsync(cancellationToken);

            if (budget is null)
            {
                throw new NotFoundException(nameof(Budget), request.Id);
            }
            return budget;
        }
    }
}
