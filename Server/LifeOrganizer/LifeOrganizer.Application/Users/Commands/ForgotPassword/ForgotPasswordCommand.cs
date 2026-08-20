using MediatR;

namespace LifeOrganizer.Application.Users.Commands.ForgotPassword
{
    public record ForgotPasswordCommand(string Email) : IRequest;
}
