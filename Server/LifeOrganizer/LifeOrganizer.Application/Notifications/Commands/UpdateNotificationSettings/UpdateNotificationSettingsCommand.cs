using MediatR;

namespace LifeOrganizer.Application.Notifications.Commands.UpdateNotificationSettings
{
    public record UpdateNotificationSettingsCommand(bool PushNotificationsEnabled) : IRequest;
}
