using FluentValidation;

namespace LifeOrganizer.Application.Finances.Commands.Budget.CreateBudget
{
    public class CreateBudgetValidator : AbstractValidator<CreateBudgetCommand>
    {
        public CreateBudgetValidator()
        {
            RuleFor(x => x.CategoryId)
                .NotEmpty();

            RuleFor(x => x.MonthlyLimit)
                .GreaterThan(0);
        }
    }
}
