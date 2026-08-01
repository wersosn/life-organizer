using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Common.Events
{
    public record UserRegisteredEvent(Guid UserId) : INotification;
}
