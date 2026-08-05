namespace LifeOrganizer.Application.Finances.Commands.Budget.CreateBudget
{
    public record BudgetDto(Guid Id, Guid CategoryId, string CategoryName, decimal MonthlyLimit);
}
