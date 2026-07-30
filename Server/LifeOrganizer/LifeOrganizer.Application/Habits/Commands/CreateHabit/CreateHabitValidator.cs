using FluentValidation;
using LifeOrganizer.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Habits.Commands.CreateHabit
{
    public class CreateHabitValidator : AbstractValidator<CreateHabitCommand>
    {
        public CreateHabitValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(200);

            RuleFor(x => x.Frequency)
                .IsInEnum();

            RuleFor(x => x.ScheduledDays)
                .NotEmpty()
                .When(x => x.Frequency is HabitFrequency.Weekly or HabitFrequency.Custom)
                .WithMessage("Scheduled days is required for Weekly, Monthly or Custom frequency");

            RuleForEach(x => x.ScheduledDays)
                .IsInEnum();

            RuleFor(x => x.CompletionDeadline)
                .Must(deadline => deadline is null || deadline.Value >= TimeSpan.Zero && deadline.Value < TimeSpan.FromDays(1))
                .WithMessage("Completion deadline must represent a valid time of day");
        }
    }
}
