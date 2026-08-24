using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Users.Commands.ConfirmEmail;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Users
{
    public class ConfirmEmailTests
    {
        private readonly ITestOutputHelper output;
        public ConfirmEmailTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task ConfirmEmail_ShouldMarkUserAsConfirmed_AndMarkTokenAsUsed()
        {
            var context = TestDbContextFactory.Create();
            var user = new User { Id = Guid.NewGuid(), Email = "test@test.com", Name = "Test", PasswordHash = "h", EmailConfirmed = false };
            context.Users.Add(user);

            var token = new VerificationToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = "valid-token",
                Type = VerificationTokenType.EmailConfirmation,
                ExpiresAt = DateTime.UtcNow.AddHours(24),
            };
            context.VerificationTokens.Add(token);
            await context.SaveChangesAsync();

            var handler = new ConfirmEmailHandler(context);
            await handler.Handle(new ConfirmEmailCommand("valid-token"), CancellationToken.None);

            var updatedUser = await context.Users.FirstAsync(u => u.Id == user.Id);
            var usedToken = await context.VerificationTokens.FirstAsync(t => t.Id == token.Id);

            Assert.True(updatedUser.EmailConfirmed);
            Assert.NotNull(usedToken.UsedAt);

            output.WriteLine("Email confirmed successfully");
        }

        [Fact]
        public async Task ConfirmEmail_ShouldThrow_WhenTokenDoesNotExist()
        {
            var context = TestDbContextFactory.Create();
            var handler = new ConfirmEmailHandler(context);

            await Assert.ThrowsAsync<InvalidTokenException>(() => handler.Handle(new ConfirmEmailCommand("nonexistent-token"), CancellationToken.None));

            output.WriteLine("Correctly rejected nonexistent token");
        }

        [Fact]
        public async Task ConfirmEmail_ShouldThrow_WhenTokenIsExpired()
        {
            var context = TestDbContextFactory.Create();
            var user = new User { Id = Guid.NewGuid(), Email = "test@test.com", Name = "Test", PasswordHash = "h", EmailConfirmed = false };
            context.Users.Add(user);

            var token = new VerificationToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = "expired-token",
                Type = VerificationTokenType.EmailConfirmation,
                ExpiresAt = DateTime.UtcNow.AddHours(-1),
            };
            context.VerificationTokens.Add(token);
            await context.SaveChangesAsync();

            var handler = new ConfirmEmailHandler(context);

            await Assert.ThrowsAsync<InvalidTokenException>(() => handler.Handle(new ConfirmEmailCommand("expired-token"), CancellationToken.None));

            output.WriteLine("Correctly rejected expired token");
        }

        [Fact]
        public async Task ConfirmEmail_ShouldThrow_WhenTokenAlreadyUsed()
        {
            var context = TestDbContextFactory.Create();
            var user = new User { Id = Guid.NewGuid(), Email = "test@test.com", Name = "Test", PasswordHash = "h", EmailConfirmed = true };
            context.Users.Add(user);

            var token = new VerificationToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = "used-token",
                Type = VerificationTokenType.EmailConfirmation,
                ExpiresAt = DateTime.UtcNow.AddHours(24),
                UsedAt = DateTime.UtcNow.AddMinutes(-5),
            };
            context.VerificationTokens.Add(token);
            await context.SaveChangesAsync();

            var handler = new ConfirmEmailHandler(context);

            await Assert.ThrowsAsync<InvalidTokenException>(() => handler.Handle(new ConfirmEmailCommand("used-token"), CancellationToken.None));

            output.WriteLine("Correctly rejected already-used token");
        }

        [Fact]
        public async Task ConfirmEmail_ShouldNotConfirmDifferentTokenType()
        {
            var context = TestDbContextFactory.Create();
            var user = new User { Id = Guid.NewGuid(), Email = "test@test.com", Name = "Test", PasswordHash = "h", EmailConfirmed = false };
            context.Users.Add(user);

            var token = new VerificationToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = "reset-not-confirm-token",
                Type = VerificationTokenType.PasswordReset,
                ExpiresAt = DateTime.UtcNow.AddHours(24),
            };
            context.VerificationTokens.Add(token);
            await context.SaveChangesAsync();

            var handler = new ConfirmEmailHandler(context);

            await Assert.ThrowsAsync<InvalidTokenException>(() => handler.Handle(new ConfirmEmailCommand("reset-not-confirm-token"), CancellationToken.None));

            output.WriteLine("Correctly rejected token of wrong type");
        }
    }
}
