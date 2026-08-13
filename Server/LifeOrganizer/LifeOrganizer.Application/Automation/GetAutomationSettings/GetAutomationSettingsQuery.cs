using MediatR;

namespace LifeOrganizer.Application.Automation.GetAutomationSettings
{
    public record GetAutomationSettingsQuery : IRequest<AutomationSettingsDto>;
}
