using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.Budget.DeleteBudget
{
    public record DeleteBudgetCommand(Guid Id) : IRequest;
}
