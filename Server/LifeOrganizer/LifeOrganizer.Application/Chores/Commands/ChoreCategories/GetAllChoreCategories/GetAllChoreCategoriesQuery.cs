using MediatR;

namespace LifeOrganizer.Application.Chores.Commands.ChoreCategories.GetAllChoreCategories
{
    public record GetAllChoreCategoriesQuery : IRequest<List<ChoreCategoryDto>>;
}
