using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Users.Commands.LoginUser
{
    public record LoginUserCommand(string Email, string Password) : IRequest<LoginUserResponse>;
    public record LoginUserResponse(string Token, Guid UserId);
}
