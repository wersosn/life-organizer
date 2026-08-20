using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Users.Commands.ConfirmEmail
{
    public class ConfirmEmailHandler : IRequestHandler<ConfirmEmailCommand>
    {
        private readonly IApplicationDbContext _context;

        public ConfirmEmailHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(ConfirmEmailCommand request, CancellationToken cancellationToken)
        {
            var token = await _context.VerificationTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Token == request.Token && t.Type == VerificationTokenType.EmailConfirmation, cancellationToken);

            if (token is null || !token.IsActive)
            {
                throw new InvalidTokenException("Invalid or expired confirmation link");
            }

            token.UsedAt = DateTime.UtcNow;
            token.User.EmailConfirmed = true;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
