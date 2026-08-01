using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.Budget.UpdateBudget
{
    public record UpdateBudgetCommand(Guid Id, decimal MonthlyLimit) : IRequest;
}
