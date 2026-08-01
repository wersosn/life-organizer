using LifeOrganizer.Application.Users.Commands.LoginUser;
using LifeOrganizer.Application.Users.Commands.RegisterUser;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
            var handler = new RegisterUserHandler(context, new NoOpPublisher());

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
                new FakeJwtTokenService()
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
            output.WriteLine("User loged in successfully");
        }
    }
}
