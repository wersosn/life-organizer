using LifeOrganizer.Application.Notifications.Commands.UpdateNotificationSettings;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Settings.Notifications
{
    public class UpdateNotificationSettingsTests
    {
        private readonly ITestOutputHelper output;
        public UpdateNotificationSettingsTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task UpdateNotificationSettings_ShouldEnablePushNotifications()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
                Email = "test@test.com",
                Name = "Test",
                PasswordHash = "hash",
                PushNotificationsEnabled = false,
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var handler = new UpdateNotificationSettingsHandler(context, new FakeCurrentUserService(userId), NullLogger<UpdateNotificationSettingsHandler>.Instance);
            await handler.Handle(new UpdateNotificationSettingsCommand(true), CancellationToken.None);

            var updatedUser = await context.Users.FirstAsync(u => u.Id == userId);
            Assert.True(updatedUser.PushNotificationsEnabled);

            output.WriteLine("Notification settings updated to enabled");
        }

        [Fact]
        public async Task UpdateNotificationSettings_ShouldDisablePushNotifications()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
                Email = "test@test.com",
                Name = "Test",
                PasswordHash = "hash",
                PushNotificationsEnabled = true,
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var handler = new UpdateNotificationSettingsHandler(context, new FakeCurrentUserService(userId), NullLogger<UpdateNotificationSettingsHandler>.Instance);
            await handler.Handle(new UpdateNotificationSettingsCommand(false), CancellationToken.None);

            var updatedUser = await context.Users.FirstAsync(u => u.Id == userId);
            Assert.False(updatedUser.PushNotificationsEnabled);

            output.WriteLine("Notification settings updated to disabled");
        }

        [Fact]
        public async Task UpdateNotificationSettings_ShouldNotAffectOtherUsers()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            context.Users.AddRange(
                new User { Id = userId, Email = "a@a.com", Name = "A", PasswordHash = "h", PushNotificationsEnabled = false },
                new User { Id = otherUserId, Email = "b@b.com", Name = "B", PasswordHash = "h", PushNotificationsEnabled = false }
            );
            await context.SaveChangesAsync();

            var handler = new UpdateNotificationSettingsHandler(context, new FakeCurrentUserService(userId), NullLogger<UpdateNotificationSettingsHandler>.Instance);
            await handler.Handle(new UpdateNotificationSettingsCommand(true), CancellationToken.None);

            var other = await context.Users.FirstAsync(u => u.Id == otherUserId);
            Assert.False(other.PushNotificationsEnabled);

            output.WriteLine("Correctly left other user's settings untouched");
        }
    }
}
