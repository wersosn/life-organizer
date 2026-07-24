using LifeOrganizer.Application.Interfaces;
using LifeOrganizer.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Tests.Helpers
{
    public class FakeJwtTokenService : IJwtTokenService
    {
        public string GenerateToken(User user)
        {
            return "fake-jwt-token";
        }
    }
}
