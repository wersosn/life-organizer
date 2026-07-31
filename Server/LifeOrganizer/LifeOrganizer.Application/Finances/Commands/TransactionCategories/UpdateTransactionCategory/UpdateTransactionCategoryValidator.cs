using FluentValidation;
namespace LifeOrganizer.Application.Finances.Commands.TransactionCategories.UpdateTransactionCategory
{
    public class UpdateTransactionCategoryValidator : AbstractValidator<UpdateTransactionCategoryCommand>
    {
        public UpdateTransactionCategoryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty();

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
