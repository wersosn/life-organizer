using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Users.Commands.LogoutUser
{
    public class LogoutUserHandler : IRequestHandler<LogoutUserCommand>
    {
        private readonly IApplicationDbContext _context;

        public LogoutUserHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(LogoutUserCommand request, CancellationToken cancellationToken)
        {
            var token = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == request.RefreshToken, cancellationToken);
            if (token is not null)
            {
                token.RevokedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
