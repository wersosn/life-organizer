using LifeOrganizer.Application.Common.Events;
using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Habits.EventHandlers
{
    public class SendPushNotificationForMissedHabitHandler : INotificationHandler<HabitMissedEvent>
    {
        private readonly IApplicationDbContext _context;
        private readonly IPushNotificationSender _pushSender;
        private readonly ILogger<SendPushNotificationForMissedHabitHandler> _logger;

        public SendPushNotificationForMissedHabitHandler(IApplicationDbContext context, IPushNotificationSender pushSender, ILogger<SendPushNotificationForMissedHabitHandler> logger)
        {
            _context = context;
            _pushSender = pushSender;
            _logger = logger;
        }

        public async Task Handle(HabitMissedEvent notification, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == notification.UserId, cancellationToken);
            if (user is null || !user.PushNotificationsEnabled || string.IsNullOrEmpty(user.PushToken))
            {
                return;
            }

            try
            {
                await _pushSender.SendAsync(user.PushToken, "Habit missed", $"You missed: {notification.HabitName}", cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send push notification for habit {HabitId}", notification.HabitId);
            }
        }
    }
}
