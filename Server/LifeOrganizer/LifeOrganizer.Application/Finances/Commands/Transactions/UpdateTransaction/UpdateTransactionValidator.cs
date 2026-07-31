using FluentValidation;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.UpdateTransaction
{
    public class UpdateTransactionValidator : AbstractValidator<UpdateTransactionCommand>
    {
        public UpdateTransactionValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty();

            RuleFor(x => x.CategoryId)
                .NotEmpty();

            RuleFor(x => x.Amount)
                .GreaterThan(0);

            RuleFor(x => x.Type)
                .IsInEnum();

            RuleFor(x => x.Description)
                .MaximumLength(500);

            RuleFor(x => x.Date)
                .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.UtcNow));
        }
    }
}
