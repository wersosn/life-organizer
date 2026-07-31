using FluentValidation;

namespace LifeOrganizer.Application.Finances.Commands.TransactionCategories.CreateTransactionCategory
{
    public class CreateTransactionCategoryValidator : AbstractValidator<CreateTransactionCategoryCommand>
    {
        public CreateTransactionCategoryValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.Icon)
                .MaximumLength(50);

            RuleFor(x => x.Type)
                .IsInEnum();
        }
    }
}
