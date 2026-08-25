using LifeOrganizer.Application.Test;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace LifeOrganizer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly IMediator mediator;
        public TestController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost("test-notification")]
        public async Task<IActionResult> SendTestNotification()
        {
            await mediator.Send(new SendTestNotificationCommand());
            return NoContent();
        }
    }
}
