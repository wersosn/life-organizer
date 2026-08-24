using LifeOrganizer.Application.Users.Commands.ForgotPassword;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Users
{
    public class ForgotPasswordTests
    {
        private readonly ITestOutputHelper output;
        public ForgotPasswordTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task ForgotPassword_ShouldSendEmail_WhenUserExistsAndEmailConfirmed()
        {
            var context = TestDbContextFactory.Create();
            var user = new User { Id = Guid.NewGuid(), Email = "test@test.com", Name = "Test", PasswordHash = "h", EmailConfirmed = true };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var emailSender = new FakeEmailSender();
            var configuration = TestConfigurationFactory.Create(new Dictionary<string, string>
            {
                ["App:DeepLinkScheme"] = "lifeorganizer"
            });

            var handler = new ForgotPasswordHandler(context, emailSender, configuration);

            await handler.Handle(new ForgotPasswordCommand("test@test.com"), CancellationToken.None);

            Assert.Single(emailSender.SentEmails);
            Assert.Equal("test@test.com", emailSender.SentEmails[0].To);

            var tokenInDb = await context.VerificationTokens.FirstOrDefaultAsync(t => t.UserId == user.Id);
            Assert.NotNull(tokenInDb);
            Assert.Equal(VerificationTokenType.PasswordReset, tokenInDb!.Type);

            output.WriteLine("Password reset email sent and token created");
        }

        [Fact]
        public async Task ForgotPassword_ShouldNotSendEmail_WhenUserDoesNotExist()
        {
            var context = TestDbContextFactory.Create();
            var emailSender = new FakeEmailSender();
            var configuration = TestConfigurationFactory.Create(new Dictionary<string, string>
            {
                ["App:DeepLinkScheme"] = "lifeorganizer"
            });

            var handler = new ForgotPasswordHandler(context, emailSender, configuration);

            await handler.Handle(new ForgotPasswordCommand("nonexistent@test.com"), CancellationToken.None);

            Assert.Empty(emailSender.SentEmails);

            output.WriteLine("Correctly stayed silent for nonexistent email (no enumeration leak)");
        }

        [Fact]
        public async Task ForgotPassword_ShouldNotSendEmail_WhenUserEmailNotConfirmed()
        {
            var context = TestDbContextFactory.Create();
            var user = new User { Id = Guid.NewGuid(), Email = "unconfirmed@test.com", Name = "Test", PasswordHash = "h", EmailConfirmed = false };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var emailSender = new FakeEmailSender();
            var configuration = TestConfigurationFactory.Create(new Dictionary<string, string>
            {
                ["App:DeepLinkScheme"] = "lifeorganizer"
            });

            var handler = new ForgotPasswordHandler(context, emailSender, configuration);

            await handler.Handle(new ForgotPasswordCommand("unconfirmed@test.com"), CancellationToken.None);

            Assert.Empty(emailSender.SentEmails);

            output.WriteLine("Correctly blocked password reset for unconfirmed email");
        }
    }
}
