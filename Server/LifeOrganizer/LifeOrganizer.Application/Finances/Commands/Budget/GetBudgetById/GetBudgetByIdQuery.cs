using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.Budget.GetBudgetById
{
    public record GetBudgetByIdQuery(Guid Id) : IRequest<BudgetDto>;
}
