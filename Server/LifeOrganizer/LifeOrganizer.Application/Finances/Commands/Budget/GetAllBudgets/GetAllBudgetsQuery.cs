using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.Budget.GetAllBudgets
{
    public record GetAllBudgetsQuery : IRequest<List<BudgetDto>>;
}
