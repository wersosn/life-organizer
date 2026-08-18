using System.Net.Http.Json;
using System.Net;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;

namespace LifeOrganizer.Tests.Integration.Tests
{
    public class LoginRateLimitTests : IntegrationTestBase
    {
        public LoginRateLimitTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task Login_ShouldReturn429_AfterFiveRequests()
        {
            using var scope = Factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "ratelimit@test.com",
                Name = "Rate Limit Test",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123"),
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var payload = new
            {
                Email = "ratelimit@test.com",
                Password = "Password123"
            };

            for (var i = 0; i < 5; i++)
            {
                var response = await Client.PostAsJsonAsync("/api/auth/login", payload);
            }
            var sixthResponse = await Client.PostAsJsonAsync("/api/auth/login", payload);

            Assert.Equal(HttpStatusCode.TooManyRequests, sixthResponse.StatusCode);
        }
    }
}
