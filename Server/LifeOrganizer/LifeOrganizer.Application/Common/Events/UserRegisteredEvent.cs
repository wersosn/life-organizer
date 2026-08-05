using MediatR;

namespace LifeOrganizer.Application.Common.Events
{
    public record UserRegisteredEvent(Guid UserId) : INotification;
}
