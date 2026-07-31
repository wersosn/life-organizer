using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Finances.Commands.Budget.CreateBudget
{
    public record BudgetDto(Guid Id, Guid CategoryId, string CategoryName, decimal MonthlyLimit);
}
