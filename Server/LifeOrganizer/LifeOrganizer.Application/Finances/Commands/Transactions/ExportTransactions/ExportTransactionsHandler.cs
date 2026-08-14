using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Finances.Commands.Transactions.ExportTransaction;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.ExportTransactions
{
    public class ExportTransactionsHandler : IRequestHandler<ExportTransactionsQuery, byte[]>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<ExportTransactionsHandler> _logger;

        public ExportTransactionsHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<ExportTransactionsHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task<byte[]> Handle(ExportTransactionsQuery request, CancellationToken cancellationToken)
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

            var transactions = await query
                .OrderBy(t => t.Date)
                .Select(t => new
                {
                    t.Date,
                    CategoryName = t.Category.Name,
                    t.Type,
                    t.Amount,
                    t.Description,
                })
                .ToListAsync(cancellationToken);

            var sb = new StringBuilder();
            sb.AppendLine("Date,Category,Type,Amount,Description");

            foreach (var t in transactions)
            {
                var description = string.IsNullOrEmpty(t.Description) ? "" : EscapeCsvField(t.Description);
                sb.AppendLine($"{t.Date:yyyy-MM-dd},{EscapeCsvField(t.CategoryName)},{t.Type},{t.Amount},{description}");
            }

            _logger.LogInformation("Transaction export completed successfully.");
            return Encoding.UTF8.GetBytes(sb.ToString());
        }

        private static string EscapeCsvField(string field)
        {
            if (field.Contains(',') || field.Contains('"') || field.Contains('\n'))
            {
                return $"\"{field.Replace("\"", "\"\"")}\"";
            }
            return field;
        }
    }
}
