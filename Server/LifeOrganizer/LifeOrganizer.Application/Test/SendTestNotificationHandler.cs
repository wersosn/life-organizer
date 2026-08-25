using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Test
{
    public class SendTestNotificationHandler : IRequestHandler<SendTestNotificationCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly IPushNotificationSender _pushSender;

        public SendTestNotificationHandler(IApplicationDbContext context, ICurrentUserService currentUser, IPushNotificationSender pushSender)
        {
            _context = context;
            _currentUser = currentUser;
            _pushSender = pushSender;
        }

        public async Task Handle(SendTestNotificationCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstAsync(u => u.Id == _currentUser.UserId, cancellationToken);

            if (string.IsNullOrEmpty(user.PushToken))
            {
                throw new InvalidOperationException("No push token registered for this user.");
            }

            await _pushSender.SendAsync(user.PushToken, "Test notification", "Push notifications are working", cancellationToken);
        }
    }
}
