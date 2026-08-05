using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.GetMonthlySummary
{
    public record TransactionDto(
        Guid Id,
        Guid CategoryId,
        string CategoryName,
        decimal Amount,
        TransactionType Type,
        string? Description,
        DateOnly Date
    );
}
