using FluentValidation;

namespace LifeOrganizer.Application.Chores.Commands.Chore.CreateChore
{
    public class CreateChoreValidator : AbstractValidator<CreateChoreCommand>
    {
        public CreateChoreValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(200);

            RuleFor(x => x.Description)
                .MaximumLength(1000);

            RuleFor(x => x.CategoryId)
                .NotEmpty();

            RuleFor(x => x.FrequencyUnit)
                .IsInEnum();

            RuleFor(x => x.FrequencyValue)
                .GreaterThan(0);
        }
    }
}
