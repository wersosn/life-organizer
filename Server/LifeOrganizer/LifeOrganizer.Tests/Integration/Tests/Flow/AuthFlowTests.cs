using LifeOrganizer.Application.Users.Commands.LoginUser;
using LifeOrganizer.Application.Users.Commands;
using LifeOrganizer.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http.Json;
using System.Net;
using Microsoft.EntityFrameworkCore;
using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Tests.Integration.Tests.Flow
{
    public class AuthFlowTests : IntegrationTestBase
    {
        public AuthFlowTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task FullFlow_RegisterConfirmLoginRefreshLogout_ShouldWorkEndToEnd()
        {
            var email = $"flow-{Guid.NewGuid()}@test.com";

            // 1. Register:
            var registerResponse = await Client.PostAsJsonAsync("/api/v1/auth/register", new
            {
                Email = email,
                Password = "Password123!",
                Name = "Flow Test"
            });
            Assert.Equal(HttpStatusCode.OK, registerResponse.StatusCode);

            // 2. Get email confirmation token:
            var confirmationEmail = Factory.EmailSender.SentEmails.Last(e => e.Subject.Contains("Confirm"));
            var confirmationToken = ExtractTokenFromEmailBody(confirmationEmail.Body);

            // 3. Email confirmation:
            var confirmResponse = await Client.PostAsJsonAsync("/api/v1/auth/confirm-email", new { Token = confirmationToken });
            Assert.Equal(HttpStatusCode.NoContent, confirmResponse.StatusCode);

            // 4. Login:
            var loginResponse = await Client.PostAsJsonAsync("/api/v1/auth/login", new { Email = email, Password = "Password123!" });
            Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);

            var loginResult = await loginResponse.Content.ReadFromJsonAsync<LoginUserResponse>();
            Assert.NotNull(loginResult);
            Assert.False(string.IsNullOrEmpty(loginResult!.Token));
            Assert.False(string.IsNullOrEmpty(loginResult.RefreshToken));

            using var scope = Factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // 5. Get refresh token:
            var refreshToken = await context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == loginResult!.RefreshToken);
            Assert.NotNull(refreshToken);
            Assert.True(refreshToken!.ExpiresAt > DateTime.UtcNow);
            Assert.Null(refreshToken.RevokedAt);

            // 6. Refresh adds new access + refresh token:
            var refreshResponse = await Client.PostAsJsonAsync("/api/v1/auth/refresh", new { RefreshToken = loginResult.RefreshToken });
            Assert.Equal(HttpStatusCode.OK, refreshResponse.StatusCode);

            var refreshResult = await refreshResponse.Content.ReadFromJsonAsync<AuthResultDto>();
            Assert.NotEqual(loginResult.RefreshToken, refreshResult!.RefreshToken); // token rotation

            // 7. Logout resets refresh token:
            var logoutResponse = await Client.PostAsJsonAsync("/api/v1/auth/logout", new { RefreshToken = refreshResult.RefreshToken });
            Assert.Equal(HttpStatusCode.NoContent, logoutResponse.StatusCode);
        }

        private static string ExtractTokenFromEmailBody(string body)
        {
            var match = System.Text.RegularExpressions.Regex.Match(body, @"token=([a-zA-Z0-9]+)");
            return match.Groups[1].Value;
        }
    }
}
