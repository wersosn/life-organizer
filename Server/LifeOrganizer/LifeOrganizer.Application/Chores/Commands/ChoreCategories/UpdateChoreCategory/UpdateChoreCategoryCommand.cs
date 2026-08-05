using MediatR;

namespace LifeOrganizer.Application.Chores.Commands.ChoreCategories.UpdateChoreCategory
{
    public record UpdateChoreCategoryCommand(Guid Id, string Name, string? Icon) : IRequest;
}
