using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Users.Commands.CurrentUser
{
    public record GetCurrentUserQuery(Guid UserId) : IRequest<CurrentUserDto>;
}
