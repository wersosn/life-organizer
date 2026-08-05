using FluentValidation;

namespace LifeOrganizer.Application.Chores.Commands.ChoreCategories.UpdateChoreCategory
{
    public class UpdateChoreCategoryValidator : AbstractValidator<UpdateChoreCategoryCommand>
    {
        public UpdateChoreCategoryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty();

            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.Icon)
                .MaximumLength(50);
        }
    }
}
