using LifeOrganizer.Domain.Enums;
using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.TransactionCategories.UpdateTransactionCategory
{
    public record UpdateTransactionCategoryCommand(Guid Id, string Name, string? Icon, TransactionType Type) : IRequest;
}
