using LifeOrganizer.Application.Users.Commands.ResetPassword;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Application
{
    public class ResetPasswordValidatorTests
    {
        private readonly ITestOutputHelper output;
        public ResetPasswordValidatorTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public void Validator_ShouldFail_WhenPasswordTooShort()
        {
            var validator = new ResetPasswordValidator();
            var result = validator.Validate(new ResetPasswordCommand("token", "short"));

            Assert.False(result.IsValid);
        }

        [Fact]
        public void Validator_ShouldFail_WhenTokenIsEmpty()
        {
            var validator = new ResetPasswordValidator();
            var result = validator.Validate(new ResetPasswordCommand("", "ValidPassword123"));

            Assert.False(result.IsValid);
        }

        [Fact]
        public void Validator_ShouldPass_WithValidTokenAndPassword()
        {
            var validator = new ResetPasswordValidator();
            var result = validator.Validate(new ResetPasswordCommand("valid-token", "ValidPassword123"));

            Assert.True(result.IsValid);
        }
    }
}
