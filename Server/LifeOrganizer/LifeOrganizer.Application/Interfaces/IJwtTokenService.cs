using LifeOrganizer.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateToken(User user);
    }
}
