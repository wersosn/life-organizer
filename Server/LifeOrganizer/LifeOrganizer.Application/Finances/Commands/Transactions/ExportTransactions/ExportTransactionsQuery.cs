using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.ExportTransaction
{
    public record ExportTransactionsQuery(DateOnly? From, DateOnly? To) : IRequest<byte[]>;
}
