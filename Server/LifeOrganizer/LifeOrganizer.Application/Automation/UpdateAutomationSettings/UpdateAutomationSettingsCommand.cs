using MediatR;

namespace LifeOrganizer.Application.Automation.UpdateAutomationSettings
{
    public record UpdateAutomationSettingsCommand(bool HabitAutomationEnabled, bool ChoreAutomationEnabled) : IRequest;
}
