using FluentValidation;

namespace LifeOrganizer.Application.Retention.Commands.UpdateRetentionSettings
{
    public class UpdateRetentionSettingsValidator : AbstractValidator<UpdateRetentionSettingsCommand>
    {
        public UpdateRetentionSettingsValidator()
        {
            RuleFor(x => x.TaskHistoryRetentionDays)
                .InclusiveBetween(1, 365);
        }
    }
}
