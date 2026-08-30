using LifeOrganizer.Application.Common.Events;
using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Chores.EventHandlers
{
    public class SendPushNotificationForOverdueChoreHandler : INotificationHandler<ChoreOverdueEvent>
    {
        private readonly IApplicationDbContext _context;
        private readonly IPushNotificationSender _pushSender;
        private readonly ILogger<SendPushNotificationForOverdueChoreHandler> _logger;

        public SendPushNotificationForOverdueChoreHandler(IApplicationDbContext context, IPushNotificationSender pushSender, ILogger<SendPushNotificationForOverdueChoreHandler> logger)
        {
            _context = context;
            _pushSender = pushSender;
            _logger = logger;
        }

        public async Task Handle(ChoreOverdueEvent notification, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == notification.UserId, cancellationToken);
            if (user is null || !user.PushNotificationsEnabled || string.IsNullOrEmpty(user.PushToken))
            {
                return;
            }

            try
            {
                await _pushSender.SendAsync(user.PushToken, "Chore overdue", $"Overdue: {notification.ChoreName}", cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send push notification for chore {ChoreId}", notification.ChoreId);
            }
        }
    }
}
