using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Notifications.Commands.RegisterPushToken
{
    public class RegisterPushTokenHandler : IRequestHandler<RegisterPushTokenCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public RegisterPushTokenHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(RegisterPushTokenCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstAsync(u => u.Id == _currentUser.UserId, cancellationToken);
            user.PushToken = request.Token;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
