using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Users.Commands.ResetPassword;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Users
{
    public class ResetPasswordTests
    {
        private readonly ITestOutputHelper output;
        public ResetPasswordTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task ResetPassword_ShouldChangePasswordAndMarkTokenAsUsed()
        {
            var context = TestDbContextFactory.Create();
            var user = new User { Id = Guid.NewGuid(), Email = "test@test.com", Name = "Test", PasswordHash = BCrypt.Net.BCrypt.HashPassword("OldPassword123") };
            context.Users.Add(user);

            var token = new VerificationToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = "valid-reset-token",
                Type = VerificationTokenType.PasswordReset,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
            };
            context.VerificationTokens.Add(token);
            await context.SaveChangesAsync();

            var handler = new ResetPasswordHandler(context);

            await handler.Handle(new ResetPasswordCommand("valid-reset-token", "NewPassword456"), CancellationToken.None);

            var updatedUser = await context.Users.FirstAsync(u => u.Id == user.Id);
            var usedToken = await context.VerificationTokens.FirstAsync(t => t.Id == token.Id);

            Assert.True(BCrypt.Net.BCrypt.Verify("NewPassword456", updatedUser.PasswordHash));
            Assert.NotNull(usedToken.UsedAt);

            output.WriteLine("Password reset successfully, token marked as used");
        }

        [Fact]
        public async Task ResetPassword_ShouldRevokeAllActiveRefreshTokens()
        {
            var context = TestDbContextFactory.Create();
            var user = new User { Id = Guid.NewGuid(), Email = "test@test.com", Name = "Test", PasswordHash = BCrypt.Net.BCrypt.HashPassword("OldPassword123") };
            context.Users.Add(user);

            var resetToken = new VerificationToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = "valid-reset-token",
                Type = VerificationTokenType.PasswordReset,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
            };
            context.VerificationTokens.Add(resetToken);

            var activeRefreshToken = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = "active-refresh-token",
                ExpiresAt = DateTime.UtcNow.AddDays(30),
            };
            context.RefreshTokens.Add(activeRefreshToken);
            await context.SaveChangesAsync();

            var handler = new ResetPasswordHandler(context);

            await handler.Handle(new ResetPasswordCommand("valid-reset-token", "NewPassword456"), CancellationToken.None);

            var refreshTokenAfter = await context.RefreshTokens.FirstAsync(t => t.Id == activeRefreshToken.Id);
            Assert.NotNull(refreshTokenAfter.RevokedAt);
            Assert.False(refreshTokenAfter.IsActive);

            output.WriteLine("All active refresh tokens correctly revoked after password reset");
        }

        [Fact]
        public async Task ResetPassword_ShouldThrow_WhenTokenIsExpired()
        {
            var context = TestDbContextFactory.Create();
            var user = new User { Id = Guid.NewGuid(), Email = "test@test.com", Name = "Test", PasswordHash = "h" };
            context.Users.Add(user);

            var token = new VerificationToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = "expired-reset-token",
                Type = VerificationTokenType.PasswordReset,
                ExpiresAt = DateTime.UtcNow.AddHours(-1),
            };
            context.VerificationTokens.Add(token);
            await context.SaveChangesAsync();

            var handler = new ResetPasswordHandler(context);

            await Assert.ThrowsAsync<InvalidTokenException>(() => handler.Handle(new ResetPasswordCommand("expired-reset-token", "NewPassword456"), CancellationToken.None));

            output.WriteLine("Correctly rejected expired reset token");
        }

        [Fact]
        public async Task ResetPassword_ShouldThrow_WhenTokenAlreadyUsed()
        {
            var context = TestDbContextFactory.Create();
            var user = new User { Id = Guid.NewGuid(), Email = "test@test.com", Name = "Test", PasswordHash = "h" };
            context.Users.Add(user);

            var token = new VerificationToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = "used-reset-token",
                Type = VerificationTokenType.PasswordReset,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                UsedAt = DateTime.UtcNow.AddMinutes(-10),
            };
            context.VerificationTokens.Add(token);
            await context.SaveChangesAsync();

            var handler = new ResetPasswordHandler(context);

            await Assert.ThrowsAsync<InvalidTokenException>(() => handler.Handle(new ResetPasswordCommand("used-reset-token", "NewPassword456"), CancellationToken.None));

            output.WriteLine("Correctly rejected already-used reset token");
        }
    }
}
