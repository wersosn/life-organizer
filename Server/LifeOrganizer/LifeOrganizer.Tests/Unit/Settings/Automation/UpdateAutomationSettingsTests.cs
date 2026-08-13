using LifeOrganizer.Application.Automation.UpdateAutomationSettings;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Settings.Automation
{
    public class UpdateAutomationSettingsTests
    {
        private readonly ITestOutputHelper output;
        public UpdateAutomationSettingsTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task UpdateAutomationSettings_ShouldUpdateBothFlagsForCurrentUser()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
                Email = "test@test.com",
                Name = "Test",
                PasswordHash = "hash",
                HabitAutomationEnabled = true,
                ChoreAutomationEnabled = true,
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var handler = new UpdateAutomationSettingsHandler(context, new FakeCurrentUserService(userId), NullLogger<UpdateAutomationSettingsHandler>.Instance);
            var command = new UpdateAutomationSettingsCommand(false, false);

            await handler.Handle(command, CancellationToken.None);

            var updated = await context.Users.FirstAsync(u => u.Id == userId);
            Assert.False(updated.HabitAutomationEnabled);
            Assert.False(updated.ChoreAutomationEnabled);

            output.WriteLine("Automation settings updated successfully");
        }

        [Fact]
        public async Task UpdateAutomationSettings_ShouldNotAffectOtherUsers()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            context.Users.AddRange(
                new User { Id = userId, Email = "a@a.com", Name = "A", PasswordHash = "psswd", HabitAutomationEnabled = true, ChoreAutomationEnabled = true },
                new User { Id = otherUserId, Email = "b@b.com", Name = "B", PasswordHash = "h", HabitAutomationEnabled = true, ChoreAutomationEnabled = true }
            );
            await context.SaveChangesAsync();

            var handler = new UpdateAutomationSettingsHandler(context, new FakeCurrentUserService(userId), NullLogger<UpdateAutomationSettingsHandler>.Instance);

            await handler.Handle(new UpdateAutomationSettingsCommand(false, true), CancellationToken.None);

            var other = await context.Users.FirstAsync(u => u.Id == otherUserId);
            Assert.True(other.HabitAutomationEnabled);
            Assert.True(other.ChoreAutomationEnabled);

            output.WriteLine("Correctly left other user settings untouched");
        }
    }
}
