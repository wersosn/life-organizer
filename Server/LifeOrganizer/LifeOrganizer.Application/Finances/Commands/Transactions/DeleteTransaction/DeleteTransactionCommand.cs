using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.DeleteTransaction
{
    public record DeleteTransactionCommand(Guid Id) : IRequest;
}
