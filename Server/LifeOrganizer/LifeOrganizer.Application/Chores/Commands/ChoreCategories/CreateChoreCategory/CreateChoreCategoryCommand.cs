using MediatR;

namespace LifeOrganizer.Application.Chores.Commands.ChoreCategories.CreateChoreCategory
{
    public record CreateChoreCategoryCommand(Guid Id, string Name, string? Icon) : IRequest<Guid>;
}
