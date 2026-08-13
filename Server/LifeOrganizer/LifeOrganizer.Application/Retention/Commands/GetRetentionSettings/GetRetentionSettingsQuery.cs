using MediatR;

namespace LifeOrganizer.Application.Retention.Commands.GetRetentionSettings
{
    public record GetRetentionSettingsQuery : IRequest<RetentionSettingsDto>;
}
