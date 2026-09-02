using LifeOrganizer.Domain.Enums;
using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.TransactionCategories.CreateTransactionCategory
{
    public record CreateTransactionCategoryCommand(Guid Id, string Name, string? Icon, TransactionType Type) : IRequest<Guid>;
}
