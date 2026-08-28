using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Notifications.Commands.GetNotificationSettings
{
    public class GetNotificationSettingsHandler : IRequestHandler<GetNotificationSettingsQuery, NotificationSettingsDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GetNotificationSettingsHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<NotificationSettingsDto> Handle(GetNotificationSettingsQuery request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstAsync(u => u.Id == _currentUser.UserId, cancellationToken);
            return new NotificationSettingsDto(user.PushNotificationsEnabled);
        }
    }
}
