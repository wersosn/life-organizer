using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Users.Commands
{
    public record RegisterUserCommand(string Email, string Name, string Password) : IRequest<Guid>;
}
