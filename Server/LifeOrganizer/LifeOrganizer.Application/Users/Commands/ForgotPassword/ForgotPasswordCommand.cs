using MediatR;

namespace LifeOrganizer.Application.Users.Commands.ResetPassword
{
    public record ForgotPasswordCommand(string Email) : IRequest;
}
