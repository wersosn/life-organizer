using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace LifeOrganizer.Application.Users.Commands.ForgotPassword
{
    /*public class ForgotPasswordHandler : IRequestHandler<ForgotPasswordCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _configuration;

        public ForgotPasswordHandler(IApplicationDbContext context, IEmailSender emailSender, IConfiguration configuration)
        {
            _context = context;
            _emailSender = emailSender;
            _configuration = configuration;
        }

        public async Task Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
            if (user is null || !user.EmailConfirmed)
            {
                return;
            }

            var resetToken = Guid.NewGuid().ToString("N");

            _context.VerificationTokens.Add(new VerificationToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = resetToken,
                Type = VerificationTokenType.PasswordReset,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
            });

            await _context.SaveChangesAsync(cancellationToken);

            var resetLink = $"{_configuration["App:BaseUrl"]}/reset-password?token={resetToken}";
            await _emailSender.SendAsync(
                user.Email,
                "Reset your password",
                $"<p>Click <a href='{resetLink}'>here</a> to reset your password. This link expires in 1 hour.</p>",
                cancellationToken);
        }
    }*/
}
