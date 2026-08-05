using FluentValidation;

namespace LifeOrganizer.Application.Chores.Commands.ChoreCategories.CreateChoreCategory
{
    public class CreateChoreCategoryValidator : AbstractValidator<CreateChoreCategoryCommand>
    {
        public CreateChoreCategoryValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.Icon)
                .MaximumLength(50);
        }
    }
}
