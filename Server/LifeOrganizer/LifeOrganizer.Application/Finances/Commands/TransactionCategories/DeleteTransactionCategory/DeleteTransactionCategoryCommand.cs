using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.TransactionCategories.DeleteTransactionCategory
{
    public record DeleteTransactionCategoryCommand(Guid Id) : IRequest;
}
