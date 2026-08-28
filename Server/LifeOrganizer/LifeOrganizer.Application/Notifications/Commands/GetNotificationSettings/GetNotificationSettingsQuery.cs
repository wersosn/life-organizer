using MediatR;

namespace LifeOrganizer.Application.Notifications.Commands.GetNotificationSettings
{
    public record GetNotificationSettingsQuery : IRequest<NotificationSettingsDto>;
}
