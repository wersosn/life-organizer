using MediatR;

namespace LifeOrganizer.Application.Chores.Commands.ChoreCategories.GetChoreCategoryById
{
    public record GetChoreCategoryByIdQuery(Guid Id) : IRequest<ChoreCategoryDto>;
}
