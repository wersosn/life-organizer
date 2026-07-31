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
                .When(x => x.Frequency is HabitFrequency.Weekly or HabitFrequency.Custom)
                .WithMessage("Scheduled days is required for Weekly, Monthly or Custom frequency");

            RuleForEach(x => x.ScheduledDays)
                .IsInEnum();

            RuleFor(x => x.CompletionDeadline)
                .InclusiveBetween(TimeSpan.Zero, TimeSpan.FromHours(24).Subtract(TimeSpan.FromTicks(1)))
                .When(x => x.CompletionDeadline.HasValue)
                .WithMessage("CompletionDeadline must be a valid time of day (00:00–23:59:59)");
        }
    }
}
