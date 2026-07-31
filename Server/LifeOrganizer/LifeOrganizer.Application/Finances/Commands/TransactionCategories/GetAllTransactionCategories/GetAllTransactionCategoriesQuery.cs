using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.TransactionCategories.GetAllTransactionCategories
{
    public record GetAllTransactionCategoriesQuery : IRequest<List<TransactionCategoryDto>>;
}
