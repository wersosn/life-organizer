using LifeOrganizer.Application.Common.Caching;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.GetMonthlySummary
{
    public class GetMonthlySummaryHandler : IRequestHandler<GetMonthlySummaryQuery, MonthlySummaryDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ICacheService _cacheService;

        public GetMonthlySummaryHandler(IApplicationDbContext context, ICurrentUserService currentUser, ICacheService cacheService)
        {
            _context = context;
            _currentUser = currentUser;
            _cacheService = cacheService;
        }

        public async Task<MonthlySummaryDto> Handle(GetMonthlySummaryQuery request, CancellationToken cancellationToken)
        {
            var cacheKey = CacheKeys.MonthlySummary(_currentUser.UserId, request.Year, request.Month);

            return await _cacheService.GetOrCreateAsync(cacheKey, async () =>
            {
                var startDate = new DateOnly(request.Year, request.Month, 1);
                var endDate = startDate.AddMonths(1).AddDays(-1);

                var transactions = await _context.Transactions
                    .Where(t => t.UserId == _currentUser.UserId && t.Date >= startDate && t.Date <= endDate)
                    .Select(t => new { t.Amount, t.Type, t.CategoryId, t.Category.Name })
                    .ToListAsync(cancellationToken);

                var totalIncome = transactions
                    .Where(t => t.Type == TransactionType.Income)
                    .Sum(t => t.Amount);

                var totalExpense = transactions
                    .Where(t => t.Type == TransactionType.Expense)
                    .Sum(t => t.Amount);

                var expensesByCategory = transactions
                    .Where(t => t.Type == TransactionType.Expense)
                    .GroupBy(t => new { t.CategoryId, t.Name })
                    .Select(g => new CategoryBreakdownDto(g.Key.CategoryId, g.Key.Name, g.Sum(t => t.Amount)))
                    .OrderByDescending(c => c.Total)
                    .ToList();

                return new MonthlySummaryDto(
                    request.Year,
                    request.Month,
                    totalIncome,
                    totalExpense,
                    totalIncome - totalExpense,
                    expensesByCategory
                );
            });
        }
    }
}
