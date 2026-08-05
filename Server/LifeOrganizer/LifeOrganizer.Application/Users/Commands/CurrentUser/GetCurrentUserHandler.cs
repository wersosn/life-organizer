using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Users.Commands.CurrentUser
{
    public class GetCurrentUserHandler : IRequestHandler<GetCurrentUserQuery, CurrentUserDto>
    {
        private readonly IApplicationDbContext _context;

        public GetCurrentUserHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CurrentUserDto> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            return new CurrentUserDto(
                user.Id,
                user.Email,
                user.Name
            );
        }
    }
}
