using FluentValidation;

namespace LifeOrganizer.Application.Users.Commands.RegisterUser
{
    public class RegisterUserValidator : AbstractValidator<RegisterUserCommand>
    {
        public RegisterUserValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress()
                .MaximumLength(256);

            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(256);

            RuleFor(x => x.Password)
                .NotEmpty()
                .MinimumLength(8)
                .MaximumLength(100);
        }
    }
}
