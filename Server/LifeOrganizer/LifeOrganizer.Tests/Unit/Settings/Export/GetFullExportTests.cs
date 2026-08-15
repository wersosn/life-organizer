using LifeOrganizer.Application.Export;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Text;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Settings.Export
{
    public class GetFullExportTests
    {
        private readonly ITestOutputHelper output;
        public GetFullExportTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetFullExport_ShouldOnlyIncludeCurrentUsersData()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            context.Users.AddRange(
                new User { Id = userId, Email = "me@test.com", Name = "Me", PasswordHash = "psswd", CreatedAt = DateTime.UtcNow },
                new User { Id = otherUserId, Email = "other@test.com", Name = "Other", PasswordHash = "h", CreatedAt = DateTime.UtcNow }
            );

            context.TodoItems.AddRange(
                new TodoItem { Id = Guid.NewGuid(), UserId = userId, Title = "Mine" },
                new TodoItem { Id = Guid.NewGuid(), UserId = otherUserId, Title = "Not mine" }
            );
            await context.SaveChangesAsync();

            var handler = new GetFullExportHandler(context, new FakeCurrentUserService(userId));

            var result = await handler.Handle(new GetFullExportQuery(), CancellationToken.None);
            var json = Encoding.UTF8.GetString(result);

            Assert.Contains("Mine", json);
            Assert.DoesNotContain("Not mine", json);

            output.WriteLine("Export correctly scoped to current user only");
        }

        [Fact]
        public async Task GetFullExport_ShouldProduceValidDeserializableJson()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();

            context.Users.Add(new User { Id = userId, Email = "me@test.com", Name = "Me", PasswordHash = "h", CreatedAt = DateTime.UtcNow });
            await context.SaveChangesAsync();

            var handler = new GetFullExportHandler(context, new FakeCurrentUserService(userId));

            var result = await handler.Handle(new GetFullExportQuery(), CancellationToken.None);
            var json = Encoding.UTF8.GetString(result);

            var deserialized = JsonSerializer.Deserialize<FullExportDto>(json, new JsonSerializerOptions
            {
                Converters = { new JsonStringEnumConverter() }
            });

            Assert.NotNull(deserialized);
            Assert.Equal("me@test.com", deserialized!.User.Email);

            output.WriteLine("Export produced valid, deserializable JSON");
        }
    }
}
