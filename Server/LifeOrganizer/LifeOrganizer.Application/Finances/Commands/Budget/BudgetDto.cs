namespace LifeOrganizer.Application.Finances.Commands.Budget
{
    public record BudgetDto(Guid Id, Guid CategoryId, string CategoryName, decimal MonthlyLimit);
}
