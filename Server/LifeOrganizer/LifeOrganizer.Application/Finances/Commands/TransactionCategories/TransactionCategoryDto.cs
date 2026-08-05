using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Application.Finances.Commands.TransactionCategories
{
    public record TransactionCategoryDto(Guid Id, string Name, string? Icon, TransactionType Type);
}
