using LifeOrganizer.Application.Users.Commands.LoginUser;
using LifeOrganizer.Application.Users.Commands.LogoutUser;
using LifeOrganizer.Application.Users.Commands.RefreshToken;
using LifeOrganizer.Application.Users.Commands.RegisterUser;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace LifeOrganizer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator mediator;
        public AuthController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserCommand command)
        {
            var id = await mediator.Send(command);
            return Ok(id);
        }

        [HttpPost("login")]
        [EnableRateLimiting("login")]
        public async Task<IActionResult> Login(LoginUserCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(RefreshTokenCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout(LogoutUserCommand command)
        {
            await mediator.Send(command);
            return NoContent();
        }
    }
}
