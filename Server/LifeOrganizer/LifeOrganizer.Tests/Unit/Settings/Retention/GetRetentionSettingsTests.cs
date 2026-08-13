using LifeOrganizer.Application.Retention.Commands.GetRetentionSettings;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Settings.Retention
{
    public class GetRetentionSettingsTests
    {
        private readonly ITestOutputHelper output;
        public GetRetentionSettingsTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetRetentionSettings_ShouldReturnCurrentUserRetentionDays()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
                Email = "test@test.com",
                Name = "Test",
                PasswordHash = "hash",
                TaskHistoryRetentionDays = 45,
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var handler = new GetRetentionSettingsHandler(context, new FakeCurrentUserService(userId));
            var result = await handler.Handle(new GetRetentionSettingsQuery(), CancellationToken.None);

            Assert.Equal(45, result.TaskHistoryRetentionDays);

            output.WriteLine("Retention settings retrieved successfully");
        }
    }
}
