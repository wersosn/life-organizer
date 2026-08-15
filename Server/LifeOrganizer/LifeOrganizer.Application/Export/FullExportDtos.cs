using LifeOrganizer.Application.Chores.Commands.ChoreCategories;
using LifeOrganizer.Application.Finances.Commands.Budget;
using LifeOrganizer.Application.Finances.Commands.TransactionCategories;
using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Application.Export
{
    public record FullExportDto(
        UserExportDto User,
        List<TodoExportDto> Todos,
        List<HabitExportDto> Habits,
        List<TransactionExportDto> Transactions,
        List<TransactionCategoryDto> TransactionCategories,
        List<BudgetDto> Budgets,
        List<ChoreExportDto> Chores,
        List<ChoreCategoryDto> ChoreCategories,
        DateTime ExportedAt
    );

    public record UserExportDto(
        string Email, 
        string Name, 
        DateTime CreatedAt
    );

    public record TodoExportDto(
        string Title, 
        string? Description, 
        bool IsCompleted, 
        DateTime CreatedAt, 
        DateTime? CompletedAt, 
        TaskSource Source
    );

    public record HabitExportDto(
        string Name, 
        HabitFrequency Frequency,
        List<DayOfWeek> ScheduledDays, 
        DateTime? CompletionDeadline, 
        List<HabitCompletionExportDto> Completions
    );

    public record HabitCompletionExportDto(DateOnly Date, HabitCompletionStatus Status);
    public record ChoreCompletionExportDto(DateTime CompletedAt, string? Notes);

    public record TransactionExportDto(
        string CategoryName, 
        decimal Amount, 
        TransactionType Type, 
        string? Description, 
        DateOnly Date
    );

    public record ChoreExportDto(
        string Name, 
        string CategoryName, 
        ChoreFrequency FrequencyUnit, 
        int FrequencyValue, 
        DateTime? LastCompletedAt, 
        List<ChoreCompletionExportDto> Completions
    );
}
