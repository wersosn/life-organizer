using LifeOrganizer.Application.Users.Commands.RefreshToken;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Users
{
    public class RefreshTokenTests
    {
        private readonly ITestOutputHelper output;
        public RefreshTokenTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task RefreshToken_ShouldRevokeOldTokenAndIssueNewOne()
        {
            var context = TestDbContextFactory.Create();
            var user = new User 
            { 
                Id = Guid.NewGuid(), 
                Email = "a@a.com", 
                Name = "A", 
                PasswordHash = "h" 
            };
            context.Users.Add(user);

            var oldToken = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = "old-token",
                ExpiresAt = DateTime.UtcNow.AddDays(30),
            };
            context.RefreshTokens.Add(oldToken);
            await context.SaveChangesAsync();

            var jwtService = new FakeJwtTokenService(); 
            var configuration = TestConfigurationFactory.Create(new Dictionary<string, string> { ["Jwt:RefreshTokenDays"] = "60" });

            var handler = new RefreshTokenHandler(context, jwtService, configuration);

            var result = await handler.Handle(new RefreshTokenCommand("old-token"), CancellationToken.None);

            var revokedToken = await context.RefreshTokens.FirstAsync(t => t.Token == "old-token");
            Assert.NotNull(revokedToken.RevokedAt);

            var newToken = await context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == result.RefreshToken);
            Assert.NotNull(newToken);
            Assert.True(newToken!.IsActive);

            output.WriteLine("Refresh token rotated successfully");
        }

        [Fact]
        public async Task RefreshToken_ShouldThrowUnauthorized_WhenTokenAlreadyRevoked()
        {
            var context = TestDbContextFactory.Create();
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "a@a.com",
                Name = "A",
                PasswordHash = "h"
            };
            context.Users.Add(user);

            var revokedToken = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = "revoked-token",
                ExpiresAt = DateTime.UtcNow.AddDays(30),
                RevokedAt = DateTime.UtcNow.AddMinutes(-5),
            };
            context.RefreshTokens.Add(revokedToken);
            await context.SaveChangesAsync();

            var handler = new RefreshTokenHandler(context, new FakeJwtTokenService(), TestConfigurationFactory.Create(new Dictionary<string, string> { ["Jwt:RefreshTokenDays"] = "60" }));

            await Assert.ThrowsAsync<Exception>(() => handler.Handle(new RefreshTokenCommand("revoked-token"), CancellationToken.None));

            output.WriteLine("Correctly rejected already-revoked refresh token");
        }

        [Fact]
        public async Task RefreshToken_ShouldThrowUnauthorized_WhenTokenExpired()
        {
            var context = TestDbContextFactory.Create();
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "a@a.com",
                Name = "A",
                PasswordHash = "h"
            };
            context.Users.Add(user);

            var expiredToken = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = "expired-token",
                ExpiresAt = DateTime.UtcNow.AddDays(-1),
            };
            context.RefreshTokens.Add(expiredToken);
            await context.SaveChangesAsync();

            var handler = new RefreshTokenHandler(context, new FakeJwtTokenService(), TestConfigurationFactory.Create(new Dictionary<string, string> { ["Jwt:RefreshTokenDays"] = "60" }));

            await Assert.ThrowsAsync<Exception>(() => handler.Handle(new RefreshTokenCommand("expired-token"), CancellationToken.None));

            output.WriteLine("Correctly rejected expired refresh token");
        }
    }
}
