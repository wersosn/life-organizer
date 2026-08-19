using MediatR;

namespace LifeOrganizer.Application.Users.Commands.LogoutUser
{
    public record LogoutUserCommand(string RefreshToken) : IRequest;
}
