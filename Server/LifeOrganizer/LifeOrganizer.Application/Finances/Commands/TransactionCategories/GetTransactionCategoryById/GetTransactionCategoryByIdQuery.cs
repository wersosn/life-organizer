using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.TransactionCategories.GetTransactionCategoryById
{
    public record GetTransactionCategoryByIdQuery(Guid Id) : IRequest<TransactionCategoryDto>;
}
