using MediatR;

namespace LifeOrganizer.Application.Chores.Commands.ChoreCategories.DeleteChoreCategory
{
    public record DeleteChoreCategoryCommand(Guid Id) : IRequest;
}
