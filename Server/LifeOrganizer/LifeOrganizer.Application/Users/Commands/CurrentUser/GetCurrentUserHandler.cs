using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Users.Commands.CurrentUser
{
    public class GetCurrentUserHandler : IRequestHandler<GetCurrentUserQuery, CurrentUserDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ILogger<GetCurrentUserHandler> _logger;

        public GetCurrentUserHandler(IApplicationDbContext context, ILogger<GetCurrentUserHandler> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<CurrentUserDto> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);
            if (user == null)
            {
                _logger.LogWarning("User not found");
                throw new InvalidOperationException("User not found");
            }

            _logger.LogInformation("User found");
            return new CurrentUserDto(
                user.Id,
                user.Email,
                user.Name
            );
        }
    }
}
