using LifeOrganizer.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http.Json;
using System.Net;
using Microsoft.EntityFrameworkCore;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Application.Users.Commands.LoginUser;

namespace LifeOrganizer.Tests.Integration.Tests.Flow
{
    public class ResetPasswordFlowTests : IntegrationTestBase
    {
        public ResetPasswordFlowTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task FullFlow_ForgotPasswordThenReset_ShouldAllowLoginWithNewPassword()
        {
            var email = $"reset-{Guid.NewGuid()}@test.com";

            // 1. Register:
            var registerResponse = await Client.PostAsJsonAsync("/api/v1/auth/register", new { Email = email, Password = "OldPassword123!", Name = "Reset Test" });
            Assert.Equal(HttpStatusCode.OK, registerResponse.StatusCode);

            // 2. Forgot password requires confirmed email:
            Guid userId;
            using (var scope = Factory.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var user = await context.Users.FirstAsync(u => u.Email == email);
                userId = user.Id;
                user.EmailConfirmed = true;
                await context.SaveChangesAsync();
            }

            // 3. Forgot password:
            var forgotResponse = await Client.PostAsJsonAsync("/api/v1/auth/forgot-password", new { Email = email });
            Assert.Equal(HttpStatusCode.OK, forgotResponse.StatusCode);
            Assert.NotEmpty(Factory.EmailSender.SentEmails);

            var resetEmail = Factory.EmailSender.SentEmails.Last(e => e.Subject.Contains("Reset"));
            Assert.Contains(email, resetEmail.To);

            // 4. Reset password token:
            string resetToken;
            using (var scope = Factory.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var token = await context.VerificationTokens.FirstAsync(t => t.UserId == userId && t.Type == VerificationTokenType.PasswordReset);
                resetToken = token.Token;
                Assert.NotEmpty(resetToken);
                Assert.Null(token.UsedAt);
                Assert.True(token.ExpiresAt > DateTime.UtcNow);
                Assert.True(token.IsActive);
                Assert.Contains(resetToken, resetEmail.Body);
            }

            // 5. Reset password:
            var resetResponse = await Client.PostAsJsonAsync("/api/v1/auth/reset-password", new { Token = resetToken, NewPassword = "NewPassword456!" });
            Assert.Equal(HttpStatusCode.NoContent, resetResponse.StatusCode);

            using (var scope = Factory.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var token = await context.VerificationTokens.FirstAsync(t => t.Token == resetToken);
                Assert.NotNull(token.UsedAt);
                Assert.False(token.IsActive);
            }

            // Old password should not work:
            var oldPasswordLoginResponse = await Client.PostAsJsonAsync("/api/v1/auth/login", new { Email = email, Password = "OldPassword123!" });

            Assert.Equal(HttpStatusCode.Unauthorized, oldPasswordLoginResponse.StatusCode);

            // New password should work:
            var newPasswordLoginResponse = await Client.PostAsJsonAsync("/api/v1/auth/login", new { Email = email, Password = "NewPassword456!" });
            Assert.Equal(HttpStatusCode.OK, newPasswordLoginResponse.StatusCode);

            var loginResult = await newPasswordLoginResponse.Content.ReadFromJsonAsync<LoginUserResponse>();
            Assert.NotNull(loginResult);
            Assert.False(string.IsNullOrEmpty(loginResult!.Token));
            Assert.False(string.IsNullOrEmpty(loginResult.RefreshToken));
        }
    }
}
