using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace LifeOrganizer.Application.Users.Commands.RefreshToken
{
    public class RefreshTokenHandler : IRequestHandler<RefreshTokenCommand, AuthResultDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IConfiguration _configuration;

        public RefreshTokenHandler(IApplicationDbContext context, IJwtTokenService jwtTokenService, IConfiguration configuration)
        {
            _context = context;
            _jwtTokenService = jwtTokenService;
            _configuration = configuration;
        }

        public async Task<AuthResultDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {
            var existingToken = await _context.RefreshTokens.Include(t => t.User).FirstOrDefaultAsync(t => t.Token == request.RefreshToken, cancellationToken);

            if (existingToken is null || !existingToken.IsActive)
            {
                throw new Exception("Invalid or expired refresh token");
            }

            existingToken.RevokedAt = DateTime.UtcNow;

            var newAccessToken = _jwtTokenService.GenerateToken(existingToken.User);
            var newRefreshTokenValue = _jwtTokenService.GenerateRefreshToken();
            var refreshDays = _configuration.GetValue<int>("Jwt:RefreshTokenDays");

            _context.RefreshTokens.Add(new Domain.Entities.RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = existingToken.UserId,
                Token = newRefreshTokenValue,
                ExpiresAt = DateTime.UtcNow.AddDays(refreshDays),
            });

            await _context.SaveChangesAsync(cancellationToken);
            return new AuthResultDto(newAccessToken, newRefreshTokenValue);
        }
    }
}
