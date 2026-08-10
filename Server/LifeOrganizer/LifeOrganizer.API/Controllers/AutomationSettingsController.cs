using LifeOrganizer.Application.Automation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeOrganizer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AutomationSettingsController : ControllerBase
    {
        private readonly IMediator mediator;
        public AutomationSettingsController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet("automation")]
        public async Task<IActionResult> GetAutomation() 
        { 
            return Ok(await mediator.Send(new GetAutomationSettingsQuery())); 
        }

        [HttpPut("automation")]
        public async Task<IActionResult> UpdateAutomation(UpdateAutomationSettingsCommand command)
        {
            await mediator.Send(command);
            return NoContent();
        }
    }
}
