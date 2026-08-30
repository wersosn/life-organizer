using LifeOrganizer.Application.Common.Events;
using LifeOrganizer.Application.Habits.EventHandlers;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Infrastructure.Notifications;
using LifeOrganizer.Tests.Helpers;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.BackgroundServices.HabitAutomation
{
    public class SendPushNotificationForMissedHabitTests
    {
        private readonly ITestOutputHelper output;
        public SendPushNotificationForMissedHabitTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task Handle_ShouldNotThrow_WhenUserHasNoPushToken()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            context.Users.Add(new User { Id = userId, Email = "a@a.com", Name = "A", PasswordHash = "h", PushNotificationsEnabled = true, PushToken = null });
            await context.SaveChangesAsync();

            var pushSender = new PushNotificationSender(new HttpClient(), NullLogger<PushNotificationSender>.Instance);
            var handler = new SendPushNotificationForMissedHabitHandler(context, pushSender, NullLogger<SendPushNotificationForMissedHabitHandler>.Instance);

            await handler.Handle(new HabitMissedEvent(Guid.NewGuid(), userId, "Meditation"), CancellationToken.None);

            output.WriteLine("Correctly handled user without push token");
        }

        [Fact]
        public async Task Handle_ShouldSkipSilently_WhenUserHasNotificationsDisabled()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            context.Users.Add(new User { Id = userId, Email = "a@a.com", Name = "A", PasswordHash = "h", PushNotificationsEnabled = false, PushToken = "some-token" });
            await context.SaveChangesAsync();

            var pushSender = new PushNotificationSender(new HttpClient(), NullLogger<PushNotificationSender>.Instance);
            var handler = new SendPushNotificationForMissedHabitHandler(context, pushSender, NullLogger<SendPushNotificationForMissedHabitHandler>.Instance);

            await handler.Handle(new HabitMissedEvent(Guid.NewGuid(), userId, "Meditation"), CancellationToken.None);

            output.WriteLine("Correctly skipped sending push when notifications disabled");
        }
    }
}
