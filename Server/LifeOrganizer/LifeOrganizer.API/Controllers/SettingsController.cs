using LifeOrganizer.Application.Automation.GetAutomationSettings;
using LifeOrganizer.Application.Automation.UpdateAutomationSettings;
using LifeOrganizer.Application.Export;
using LifeOrganizer.Application.Retention.Commands.GetRetentionSettings;
using LifeOrganizer.Application.Retention.Commands.UpdateRetentionSettings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeOrganizer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SettingsController : ControllerBase
    {
        private readonly IMediator mediator;
        public SettingsController(IMediator mediator)
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

        [HttpGet("retention")]
        public async Task<IActionResult> GetRetention()
        {
            return Ok(await mediator.Send(new GetRetentionSettingsQuery()));
        }

        [HttpPut("retention")]
        public async Task<IActionResult> UpdateRetention(UpdateRetentionSettingsCommand command)
        {
            await mediator.Send(command);
            return NoContent();
        }

        [HttpGet("fullexport")]
        public async Task<IActionResult> ExportFull()
        {
            var bytes = await mediator.Send(new GetFullExportQuery());
            var fileName = $"lifeorganizer_export_{DateTime.UtcNow:yyyyMMdd}.json";
            return File(bytes, "application/json", fileName);
        }
    }
}
