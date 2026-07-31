using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Finances.Commands.Transactions.GetMonthlySummary;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.GetAllTransactions
{
    public class GetAllTransactionsHandler : IRequestHandler<GetAllTransactionsQuery, List<TransactionDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GetAllTransactionsHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<List<TransactionDto>> Handle(GetAllTransactionsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Transactions.Where(t => t.UserId == _currentUser.UserId);

            if (request.From.HasValue)
            {
                query = query.Where(t => t.Date >= request.From.Value);
            }

            if (request.To.HasValue)
            {
                query = query.Where(t => t.Date <= request.To.Value);
            }

            return await query
                .OrderByDescending(t => t.Date)
                .Select(t => new TransactionDto(
                    t.Id,
                    t.CategoryId,
                    t.Category.Name,
                    t.Amount,
                    t.Type,
                    t.Description,
                    t.Date))
                .ToListAsync(cancellationToken);
        }
    }
}
