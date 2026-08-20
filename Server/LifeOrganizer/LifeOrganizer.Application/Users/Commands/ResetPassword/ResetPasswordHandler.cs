using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Users.Commands.ResetPassword
{
    /*public class ResetPasswordHandler : IRequestHandler<ResetPasswordCommand>
    {
        private readonly IApplicationDbContext _context;

        public ResetPasswordHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
        {
            var token = await _context.VerificationTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Token == request.Token && t.Type == VerificationTokenType.PasswordReset, cancellationToken);

            if (token is null || !token.IsActive)
            {
                throw new InvalidTokenException("Invalid or expired reset link");
            }

            token.UsedAt = DateTime.UtcNow;
            token.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
  
            var activeRefreshTokens = await _context.RefreshTokens
                .Where(rt => rt.UserId == token.UserId && rt.RevokedAt == null)
                .ToListAsync(cancellationToken);

            foreach (var rt in activeRefreshTokens)
            {
                rt.RevokedAt = DateTime.UtcNow;
            }
            await _context.SaveChangesAsync(cancellationToken);
        }
    }*/
}
