using FluentValidation;
using LifeOrganizer.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Habits.Commands.UpdateHabit
{
    public class UpdateHabitValidator : AbstractValidator<UpdateHabitCommand>
    {
        public UpdateHabitValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty();

            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(200);

            RuleFor(x => x.Frequency)
                .IsInEnum();

            RuleFor(x => x.ScheduledDays)
                .NotEmpty()
                .When(x => x.Frequency is HabitFrequency.Weekly or HabitFrequency.Monthly or HabitFrequency.Custom)
                .WithMessage("ScheduledDays is required for Weekly, Monthly or Custom frequency.");

            RuleForEach(x => x.ScheduledDays)
                .IsInEnum();

            RuleFor(x => x.CompletionDeadline)
                .Must(deadline => deadline is null || (deadline.Value >= TimeSpan.Zero && deadline.Value < TimeSpan.FromDays(1)))
                .WithMessage("CompletionDeadline must represent a valid time of day.");
        }
    }
}
