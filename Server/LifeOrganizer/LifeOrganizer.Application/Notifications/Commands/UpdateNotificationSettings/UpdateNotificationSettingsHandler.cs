using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Notifications.Commands.UpdateNotificationSettings
{
    public class UpdateNotificationSettingsHandler : IRequestHandler<UpdateNotificationSettingsCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<UpdateNotificationSettingsHandler> _logger;

        public UpdateNotificationSettingsHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<UpdateNotificationSettingsHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task Handle(UpdateNotificationSettingsCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == _currentUser.UserId, cancellationToken);
            if (user is null)
            {
                _logger.LogWarning("Notification settings update failed: user not found.");
                throw new NotFoundException(nameof(User), _currentUser.UserId);
            }
            user.PushNotificationsEnabled = request.PushNotificationsEnabled;
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Notification settings updated successfully.");
        }
    }
}
