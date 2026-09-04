using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using Respawn;

namespace LifeOrganizer.Tests.Integration
{
    [Collection("Integration")]
    public abstract class IntegrationTestBase : IAsyncLifetime
    {
        protected readonly CustomWebApplicationFactory Factory;
        protected readonly HttpClient Client;

        private Respawner respawner = null!;
        private NpgsqlConnection connection = null!;

        protected IntegrationTestBase(CustomWebApplicationFactory factory)
        {
            Factory = factory;
            Client = factory.CreateClient();
            TestAuthHandler.CurrentUserId = Guid.NewGuid();
        }

        public async Task InitializeAsync()
        {
            connection = new NpgsqlConnection(Factory.ConnectionString);
            await connection.OpenAsync();

            respawner = await Respawner.CreateAsync(connection, new RespawnerOptions
            {
                SchemasToInclude = new[] { "public" },
                DbAdapter = DbAdapter.Postgres
            });

            await SeedCurrentUserAsync();
        }

        private async Task SeedCurrentUserAsync()
        {
            using var scope = Factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            context.Users.Add(new User
            {
                Id = TestAuthHandler.CurrentUserId,
                Email = $"{TestAuthHandler.CurrentUserId}@test.com",
                Name = "Test User",
                PasswordHash = "test-hash",
                CreatedAt = DateTime.UtcNow
            });

            await context.SaveChangesAsync();
        }

        public async Task DisposeAsync()
        {
            await respawner.ResetAsync(connection);
            await connection.CloseAsync();
            await connection.DisposeAsync();
            Factory.EmailSender.SentEmails.Clear();
        }
    }

    [CollectionDefinition("Integration")]
    public class IntegrationCollection : ICollectionFixture<CustomWebApplicationFactory>
    {
    }
}
