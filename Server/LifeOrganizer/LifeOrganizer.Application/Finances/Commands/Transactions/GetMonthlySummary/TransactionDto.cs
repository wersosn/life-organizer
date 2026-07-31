using LifeOrganizer.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.GetMonthlySummary
{
    public record TransactionDto(
        Guid Id,
        Guid CategoryId,
        string CategoryName,
        decimal Amount,
        TransactionType Type,
        string? Description,
        DateOnly Date
    );
}
