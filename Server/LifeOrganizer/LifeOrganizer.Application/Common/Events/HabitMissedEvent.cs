using MediatR;

namespace LifeOrganizer.Application.Common.Events
{
    public record HabitMissedEvent(Guid HabitId, Guid UserId, string HabitName) : INotification;
}
