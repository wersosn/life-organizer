using LifeOrganizer.Domain.Enums;
using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.CreateTransaction
{
    public record CreateTransactionCommand(Guid CategoryId, decimal Amount, TransactionType Type, string? Description, DateOnly Date) : IRequest<Guid>;
}
