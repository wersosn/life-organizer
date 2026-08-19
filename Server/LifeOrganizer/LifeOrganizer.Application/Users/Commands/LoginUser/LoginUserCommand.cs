using MediatR;

namespace LifeOrganizer.Application.Users.Commands.LoginUser
{
    public record LoginUserCommand(string Email, string Password) : IRequest<LoginUserResponse>;
    public record LoginUserResponse(string Token, string RefreshToken, Guid UserId);
}
