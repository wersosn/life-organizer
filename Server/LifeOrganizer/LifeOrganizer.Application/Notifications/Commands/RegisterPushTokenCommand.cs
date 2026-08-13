using MediatR;

namespace LifeOrganizer.Application.Notifications.Commands
{
    public record RegisterPushTokenCommand(string Token) : IRequest;
}
