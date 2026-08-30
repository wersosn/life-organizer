using MediatR;

namespace LifeOrganizer.Application.Common.Events
{
    public record ChoreOverdueEvent(Guid ChoreId, Guid UserId, string ChoreName) : INotification;
}
