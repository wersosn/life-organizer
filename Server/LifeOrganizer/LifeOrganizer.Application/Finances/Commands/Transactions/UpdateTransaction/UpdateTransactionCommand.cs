using LifeOrganizer.Domain.Enums;
using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.UpdateTransaction
{
    public record UpdateTransactionCommand(Guid Id, Guid CategoryId, decimal Amount, TransactionType Type, string? Description, DateOnly Date) : IRequest;
}
