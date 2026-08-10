using MediatR;

namespace LifeOrganizer.Application.Automation
{
    public record GetAutomationSettingsQuery : IRequest<AutomationSettingsDto>;
}
