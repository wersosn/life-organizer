using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Finances.Commands.Budget.GetBudgetWithUsage
{
    public record BudgetUsageDto(
        Guid Id,
        Guid CategoryId,
        string CategoryName,
        decimal MonthlyLimit,
        decimal Spent,
        decimal Remaining,
        decimal PercentageUsed,
        bool IsExceeded
    );
}
