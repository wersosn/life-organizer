using MediatR;

namespace LifeOrganizer.Application.Retention.Commands.UpdateRetentionSettings
{
    public record UpdateRetentionSettingsCommand(int TaskHistoryRetentionDays) : IRequest;
}
