using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.Budget.CreateBudget
{
    public record CreateBudgetCommand(Guid CategoryId, decimal MonthlyLimit) : IRequest<Guid>;
}
