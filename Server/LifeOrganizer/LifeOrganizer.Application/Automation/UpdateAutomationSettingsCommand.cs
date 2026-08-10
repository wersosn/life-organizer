using MediatR;

namespace LifeOrganizer.Application.Automation
{
    public record UpdateAutomationSettingsCommand(bool HabitAutomationEnabled, bool ChoreAutomationEnabled) : IRequest;
}
