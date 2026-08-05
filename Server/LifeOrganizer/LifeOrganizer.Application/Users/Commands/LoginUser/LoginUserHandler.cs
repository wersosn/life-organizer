using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Users.Commands.LoginUser
{
    public class LoginUserHandler : IRequestHandler<LoginUserCommand, LoginUserResponse>
    {
        private readonly IApplicationDbContext _context;
        private readonly IJwtTokenService _jwtService;

        public LoginUserHandler(IApplicationDbContext context, IJwtTokenService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }


        public async Task<LoginUserResponse> Handle(LoginUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken);
            if (user == null)
            {
                throw new InvalidCredentialsException("Invalid credentials");
            }

            var passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!passwordValid)
            {
                throw new InvalidCredentialsException("Invalid credentials");
            }

            var token = _jwtService.GenerateToken(user);
            return new LoginUserResponse(token, user.Id);
        }
    }
}
