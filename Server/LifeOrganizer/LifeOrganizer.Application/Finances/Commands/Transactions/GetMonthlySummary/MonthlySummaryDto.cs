namespace LifeOrganizer.Application.Finances.Commands.Transactions.GetMonthlySummary
{
    public record MonthlySummaryDto(
        int Year,
        int Month,
        decimal TotalIncome,
        decimal TotalExpense,
        decimal Balance,
        List<CategoryBreakdownDto> ExpensesByCategory
    );

    public record CategoryBreakdownDto(Guid CategoryId, string CategoryName, decimal Total);
}
