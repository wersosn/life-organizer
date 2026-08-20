using MediatR;

namespace LifeOrganizer.Application.Users.Commands.ConfirmEmail
{
    public record ConfirmEmailCommand(string Token) : IRequest;
}
