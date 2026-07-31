using LifeOrganizer.Application.Finances.Commands.Transactions.GetMonthlySummary;
using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.GetAllTransactions
{
    public record GetAllTransactionsQuery(DateOnly? From, DateOnly? To) : IRequest<List<TransactionDto>>;
}
