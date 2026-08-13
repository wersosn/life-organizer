using LifeOrganizer.Application.Automation.UpdateAutomationSettings;
using LifeOrganizer.Application.Retention.Commands.UpdateRetentionSettings;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Settings.Retention
{
    public class UpdateRetentionSettingsTests
    {
        private readonly ITestOutputHelper output;
        public UpdateRetentionSettingsTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task UpdateRetentionSettings_ShouldUpdateRetentionDaysForCurrentUser()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
                Email = "test@test.com",
                Name = "Test",
                PasswordHash = "hash",
                TaskHistoryRetentionDays = 30,
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var handler = new UpdateRetentionSettingsHandler(context, new FakeCurrentUserService(userId), NullLogger<UpdateRetentionSettingsHandler>.Instance);
            await handler.Handle(new UpdateRetentionSettingsCommand(90), CancellationToken.None);

            var updated = await context.Users.FirstAsync(u => u.Id == userId);
            Assert.Equal(90, updated.TaskHistoryRetentionDays);

            output.WriteLine("Retention settings updated successfully");
        }

        [Fact]
        public async Task UpdateRetentionSettings_ShouldNotAffectOtherUsers()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            context.Users.AddRange(
                new User { Id = userId, Email = "a@a.com", Name = "A", PasswordHash = "h", TaskHistoryRetentionDays = 30 },
                new User { Id = otherUserId, Email = "b@b.com", Name = "B", PasswordHash = "h", TaskHistoryRetentionDays = 30 }
            );
            await context.SaveChangesAsync();

            var handler = new UpdateRetentionSettingsHandler(context, new FakeCurrentUserService(userId), NullLogger<UpdateRetentionSettingsHandler>.Instance);
            await handler.Handle(new UpdateRetentionSettingsCommand(120), CancellationToken.None);

            var other = await context.Users.FirstAsync(u => u.Id == otherUserId);
            Assert.Equal(30, other.TaskHistoryRetentionDays);

            output.WriteLine("Correctly left other user's retention setting untouched");
        }
    }
}
