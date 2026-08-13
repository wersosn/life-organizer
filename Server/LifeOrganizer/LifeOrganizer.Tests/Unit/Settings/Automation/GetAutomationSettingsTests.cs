using LifeOrganizer.Application.Automation.GetAutomationSettings;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Settings.Automation
{
    public class GetAutomationSettingsTests
    {
        private readonly ITestOutputHelper output;
        public GetAutomationSettingsTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetAutomationSettings_ShouldReturnCurrentUserSettings()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
                Email = "test@test.com",
                Name = "Test",
                PasswordHash = "hash",
                HabitAutomationEnabled = false,
                ChoreAutomationEnabled = true,
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var handler = new GetAutomationSettingsHandler(context, new FakeCurrentUserService(userId));

            var result = await handler.Handle(new GetAutomationSettingsQuery(), CancellationToken.None);

            Assert.False(result.HabitAutomationEnabled);
            Assert.True(result.ChoreAutomationEnabled);

            output.WriteLine("Automation settings retrieved successfully");
        }
    }
}
