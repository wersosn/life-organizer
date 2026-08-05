using FluentValidation;

namespace LifeOrganizer.Application.Chores.Commands.Chore.CompleChore
{
    public class CompleteChoreValidator : AbstractValidator<CompleteChoreCommand>
    {
        public CompleteChoreValidator()
        {
            RuleFor(x => x.ChoreId)
                .NotEmpty();

            RuleFor(x => x.Notes)
                .MaximumLength(500);

            RuleFor(x => x.CompletedAt)
                .Must(date => date is null || date.Value <= DateTime.UtcNow)
                .WithMessage("Cannot log a completion in the future.");
        }
    }
}
