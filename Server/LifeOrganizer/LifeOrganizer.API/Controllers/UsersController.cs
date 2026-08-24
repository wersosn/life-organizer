using LifeOrganizer.Application.Users.Commands.ConfirmEmail;
using LifeOrganizer.Application.Users.Commands.CurrentUser;
using LifeOrganizer.Application.Users.Commands.ForgotPassword;
using LifeOrganizer.Application.Users.Commands.ResetPassword;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LifeOrganizer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IMediator mediator;
        public UsersController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await mediator.Send(
                new GetCurrentUserQuery(
                    Guid.Parse(userId)
                )
            );
            return Ok(result);
        }  
    }
}
