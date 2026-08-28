using MediatR;

namespace LifeOrganizer.Application.Notifications.Commands.RegisterPushToken
{
    public record RegisterPushTokenCommand(string Token) : IRequest;
}
