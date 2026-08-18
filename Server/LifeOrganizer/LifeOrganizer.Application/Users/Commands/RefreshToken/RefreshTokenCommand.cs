using MediatR;

namespace LifeOrganizer.Application.Users.Commands.RefreshToken
{
    public record RefreshTokenCommand(string RefreshToken) : IRequest<AuthResultDto>;
}
