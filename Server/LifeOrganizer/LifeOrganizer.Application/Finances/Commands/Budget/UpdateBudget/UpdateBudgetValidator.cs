using FluentValidation;

namespace LifeOrganizer.Application.Finances.Commands.Budget.UpdateBudget
{
    public class UpdateBudgetValidator : AbstractValidator<UpdateBudgetCommand>
    {
        public UpdateBudgetValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty();

            RuleFor(x => x.MonthlyLimit)
                .GreaterThan(0);
        }
    }
}
