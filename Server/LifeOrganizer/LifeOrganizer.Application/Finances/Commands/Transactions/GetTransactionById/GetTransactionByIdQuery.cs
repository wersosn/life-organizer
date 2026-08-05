using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.GetTransactionById
{
    public record GetTransactionByIdQuery(Guid Id) : IRequest<TransactionDto>;
}
