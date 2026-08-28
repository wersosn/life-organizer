using LifeOrganizer.Application.Common.Events;
using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Users.Commands.RegisterUser
{
    public class RegisterUserHandler : IRequestHandler<RegisterUserCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly IPublisher _publisher;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _configuration;
        private readonly ILogger<RegisterUserHandler> _logger;

        public RegisterUserHandler(IApplicationDbContext context, IPublisher publisher, IEmailSender emailSender, IConfiguration configuration, ILogger<RegisterUserHandler> logger)
        {
            _context = context;
            _publisher = publisher;
            _emailSender = emailSender;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<Guid> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            var userExists = await _context.Users.AnyAsync(x => x.Email == request.Email, cancellationToken);
            if (userExists)
            {
                _logger.LogWarning("User registration failed: user already exists.");
                throw new ConflictException("User with this email already exists");
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                Name = request.Name,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow
            };
            await _context.Users.AddAsync(user, cancellationToken);

            var confirmationToken = Guid.NewGuid().ToString("N");
            _context.VerificationTokens.Add(new VerificationToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = confirmationToken,
                Type = VerificationTokenType.EmailConfirmation,
                ExpiresAt = DateTime.UtcNow.AddHours(24),
            });

            await _context.SaveChangesAsync(cancellationToken);

            /* Deep link for later: */
            var confirmationLink = $"{_configuration["App:DeepLinkScheme"]}://confirmEmail?token={confirmationToken}";
            await _emailSender.SendAsync(
                user.Email,
                "Confirm your email",
                $"<p>Welcome to LifeOrganizer! Click <a href='{confirmationLink}'>here</a> to confirm your email.</p>",
                cancellationToken);

            /*await _emailSender.SendAsync(
                user.Email,
                "Confirm your email",
                $"<p>Your confirmation token is:</p><p><strong>{confirmationToken}</strong></p><p>Copy this token and use it with the /api/Users/confirm-email endpoint.</p>",
                cancellationToken);*/

            await _publisher.Publish(new UserRegisteredEvent(user.Id), cancellationToken);

            _logger.LogInformation("User registered successfully. UserId: {UserId}", user.Id);
            return user.Id;
        }
    }
}
