using LifeOrganizer.Application.Users.Commands.LoginUser;
using LifeOrganizer.Application.Users.Commands.LogoutUser;
using LifeOrganizer.Application.Users.Commands.RegisterUser;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Users
{
    public class AuthTests
    {
        private readonly ITestOutputHelper output;
        public AuthTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task Register_ShouldCreateUser()
        {
            var context = TestDbContextFactory.Create();
            var handler = new RegisterUserHandler(context, new NoOpPublisher(), NullLogger<RegisterUserHandler>.Instance);

            var command = new RegisterUserCommand(
                "test@test.com",
                "Test",
                "Password123"
            );

            var id = await handler.Handle(
                command,
                CancellationToken.None
            );

            var user = await context.Users.FirstAsync();
            Assert.Equal(id, user.Id);
            output.WriteLine("User created successfully");
        }

        [Fact]
        public async Task Login_ShouldLoginUser()
        {
            var context = TestDbContextFactory.Create();
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@test.com",
                Name = "Test User",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123")
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            var handler = new LoginUserHandler(
                context,
                new FakeJwtTokenService(),
                TestConfigurationFactory.Create(new Dictionary<string, string> { ["Jwt:RefreshTokenDays"] = "60" }),
                NullLogger<LoginUserHandler>.Instance
            );

            var command = new LoginUserCommand(
                "test@test.com",
                "Password123"
            );

            var result = await handler.Handle(
                command,
                CancellationToken.None
            );

            Assert.NotNull(result);
            Assert.Equal("fake-jwt-token", result.Token);
            Assert.Equal(user.Id, result.UserId);

            var refreshToken = await context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == result.RefreshToken);
            Assert.NotNull(refreshToken);
            Assert.True(refreshToken!.IsActive);

            output.WriteLine("User loged in successfully");
        }

        [Fact]
        public async Task Logout_ShouldRevokeRefreshToken()
        {
            var context = TestDbContextFactory.Create();

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@test.com",
                Name = "Test",
                PasswordHash = "hash"
            };

            var refreshToken = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = "refresh-token",
                ExpiresAt = DateTime.UtcNow.AddDays(30)
            };

            context.Users.Add(user);
            context.RefreshTokens.Add(refreshToken);
            await context.SaveChangesAsync();

            var handler = new LogoutUserHandler(context);
            await handler.Handle(
                new LogoutUserCommand("refresh-token"),
                CancellationToken.None);

            var revokedToken = await context.RefreshTokens.FirstAsync(t => t.Token == "refresh-token");

            Assert.NotNull(revokedToken.RevokedAt);
            Assert.False(revokedToken.IsActive);

            output.WriteLine("Refresh token was successfully revoked during logout");
        }

        [Fact]
        public async Task Logout_ShouldDoNothing_WhenRefreshTokenDoesNotExist()
        {
            var context = TestDbContextFactory.Create();
            var handler = new LogoutUserHandler(context);

            await handler.Handle(
                new LogoutUserCommand("non-existent-token"),
                CancellationToken.None);

            var tokens = await context.RefreshTokens.ToListAsync();

            Assert.Empty(tokens);

            output.WriteLine("Logout correctly ignored a non-existent refresh token");
        }
    }
}
