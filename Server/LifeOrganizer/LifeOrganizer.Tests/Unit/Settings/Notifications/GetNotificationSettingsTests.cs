using LifeOrganizer.Application.Notifications.Commands.GetNotificationSettings;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Settings.Notifications
{
    public class GetNotificationSettingsTests
    {
        private readonly ITestOutputHelper output;
        public GetNotificationSettingsTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetNotificationSettings_ShouldReturnCurrentUserSettings_WhenEnabled()
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

            var handler = new GetNotificationSettingsHandler(context, new FakeCurrentUserService(userId));
            var result = await handler.Handle(new GetNotificationSettingsQuery(), CancellationToken.None);

            Assert.True(result.PushNotificationsEnabled);

            output.WriteLine("Notification settings retrieved successfully (enabled)");
        }

        [Fact]
        public async Task GetNotificationSettings_ShouldReturnCurrentUserSettings_WhenDisabled()
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

            var handler = new GetNotificationSettingsHandler(context, new FakeCurrentUserService(userId));
            var result = await handler.Handle(new GetNotificationSettingsQuery(), CancellationToken.None);

            Assert.False(result.PushNotificationsEnabled);

            output.WriteLine("Notification settings retrieved successfully (disabled)");
        }

        [Fact]
        public async Task GetNotificationSettings_ShouldNotReturnOtherUsersSettings()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            context.Users.AddRange(
                new User { Id = userId, Email = "a@a.com", Name = "A", PasswordHash = "h", PushNotificationsEnabled = true },
                new User { Id = otherUserId, Email = "b@b.com", Name = "B", PasswordHash = "h", PushNotificationsEnabled = false }
            );
            await context.SaveChangesAsync();

            var handler = new GetNotificationSettingsHandler(context, new FakeCurrentUserService(userId));
            var result = await handler.Handle(new GetNotificationSettingsQuery(), CancellationToken.None);

            Assert.True(result.PushNotificationsEnabled);

            output.WriteLine("Correctly returned only current user's settings");
        }
    }
}
