using MediatR;

namespace LifeOrganizer.Application.Chores.Commands.ChoreCategories.CreateChoreCategory
{
    public record CreateChoreCategoryCommand(string Name, string? Icon) : IRequest<Guid>;
}
