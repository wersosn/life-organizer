using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Finances.Commands.Budget.CreateBudget;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Finances.Commands.Budget.GetAllBudgets
{
    public class GetAllBudgetsHandler : IRequestHandler<GetAllBudgetsQuery, List<BudgetDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GetAllBudgetsHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<List<BudgetDto>> Handle(GetAllBudgetsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Budgets
                .Where(b => b.UserId == _currentUser.UserId)
                .OrderBy(b => b.Category.Name)
                .Select(b => new BudgetDto(b.Id, b.CategoryId, b.Category.Name, b.MonthlyLimit))
                .ToListAsync(cancellationToken);
        }
    }
}
