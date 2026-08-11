using MediatR;

namespace LifeOrganizer.Application.Notifications
{
    public record RegisterPushTokenCommand(string Token) : IRequest;
}
