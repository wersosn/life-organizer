using LifeOrganizer.Domain.Entities;

namespace LifeOrganizer.Application.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateToken(User user);
        string GenerateRefreshToken();
    }
}
