using MediatR;

namespace LifeOrganizer.Application.Users.Commands.ResetPassword
{
    public record ResetPasswordCommand(string Token, string NewPassword) : IRequest;
}
