using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Users.Commands.LoginUser
{
    public class LoginUserHandler : IRequestHandler<LoginUserCommand, LoginUserResponse>
    {
        private readonly IApplicationDbContext _context;
        private readonly IJwtTokenService _jwtService;
        private readonly ILogger<LoginUserHandler> _logger;

        public LoginUserHandler(IApplicationDbContext context, IJwtTokenService jwtService, ILogger<LoginUserHandler> logger)
        {
            _context = context;
            _jwtService = jwtService;
            _logger = logger;
        }

        public async Task<LoginUserResponse> Handle(LoginUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken);
            if (user == null)
            {
                _logger.LogWarning("Login failed: invalid credentials.");
                throw new InvalidCredentialsException("Invalid credentials");
            }

            var passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!passwordValid)
            {
                _logger.LogWarning("Login failed: invalid credentials.");
                throw new InvalidCredentialsException("Invalid credentials");
            }

            var token = _jwtService.GenerateToken(user);
            _logger.LogInformation("User logged in successfully. UserId: {UserId}", user.Id);
            return new LoginUserResponse(token, user.Id);
        }
    }
}
