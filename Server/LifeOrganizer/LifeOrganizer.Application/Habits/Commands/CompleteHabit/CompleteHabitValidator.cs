using FluentValidation;

namespace LifeOrganizer.Application.Habits.Commands.CompleteHabit
{
    public class CompleteHabitValidator : AbstractValidator<CompleteHabitCommand>
    {
        public CompleteHabitValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty();

            RuleFor(x => x.Date)
                .Must(date => date is null || date.Value <= DateOnly.FromDateTime(DateTime.UtcNow))
                .WithMessage("Cannot complete a habit for a future date");
        }
    }
}
