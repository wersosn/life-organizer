using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Finances.Commands.Budget.CreateBudget
{
    public record CreateBudgetCommand(Guid CategoryId, decimal MonthlyLimit) : IRequest<Guid>;
}
