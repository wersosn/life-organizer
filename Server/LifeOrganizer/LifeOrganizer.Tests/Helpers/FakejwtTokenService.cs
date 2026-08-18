using LifeOrganizer.Application.Interfaces;
using LifeOrganizer.Domain.Entities;

namespace LifeOrganizer.Tests.Helpers
{
    public class FakeJwtTokenService : IJwtTokenService
    {
        public string GenerateToken(User user)
        {
            return "fake-jwt-token";
        }

        public string GenerateRefreshToken()
        {
            return "fake-refresh-jwt-token";
        }
    }
}
