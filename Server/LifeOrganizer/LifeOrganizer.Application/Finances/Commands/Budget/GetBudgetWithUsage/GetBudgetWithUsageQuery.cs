using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.Budget.GetBudgetWithUsage
{
    public record GetBudgetWithUsageQuery(int Year, int Month) : IRequest<List<BudgetUsageDto>>;
}
