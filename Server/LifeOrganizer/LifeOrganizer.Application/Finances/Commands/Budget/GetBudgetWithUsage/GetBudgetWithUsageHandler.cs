using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Finances.Commands.Budget.GetBudgetWithUsage
{
    public class GetBudgetWithUsageHandler : IRequestHandler<GetBudgetWithUsageQuery, List<BudgetUsageDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GetBudgetWithUsageHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<List<BudgetUsageDto>> Handle(GetBudgetWithUsageQuery request, CancellationToken cancellationToken)
        {
            var startDate = new DateOnly(request.Year, request.Month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            var budgets = await _context.Budgets
                .Where(b => b.UserId == _currentUser.UserId)
                .Select(b => new { b.Id, b.CategoryId, CategoryName = b.Category.Name, b.MonthlyLimit })
                .ToListAsync(cancellationToken);

            if (budgets.Count == 0)
            {
                return new List<BudgetUsageDto>();
            }

            var categoryIds = budgets.Select(b => b.CategoryId).ToList();
            var spentByCategory = await _context.Transactions
                .Where(t => t.UserId == _currentUser.UserId
                    && categoryIds.Contains(t.CategoryId)
                    && t.Type == TransactionType.Expense
                    && t.Date >= startDate
                    && t.Date <= endDate)
                .GroupBy(t => t.CategoryId)
                .Select(g => new { CategoryId = g.Key, Total = g.Sum(t => t.Amount) })
                .ToDictionaryAsync(x => x.CategoryId, x => x.Total, cancellationToken);

            return budgets.Select(b =>
            {
                var spent = spentByCategory.GetValueOrDefault(b.CategoryId, 0);
                var percentage = b.MonthlyLimit == 0 ? 0 : Math.Round(spent / b.MonthlyLimit * 100, 1);
                return new BudgetUsageDto(
                    b.Id,
                    b.CategoryId,
                    b.CategoryName,
                    b.MonthlyLimit,
                    spent,
                    b.MonthlyLimit - spent,
                    percentage,
                    spent > b.MonthlyLimit
                );
            }).ToList();
        }
    }
}
