using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.Budget.CreateBudget
{
    public record CreateBudgetCommand(Guid Id, Guid CategoryId, decimal MonthlyLimit) : IRequest<Guid>;
}
