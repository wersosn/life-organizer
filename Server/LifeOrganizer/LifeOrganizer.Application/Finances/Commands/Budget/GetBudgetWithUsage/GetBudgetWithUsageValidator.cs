using FluentValidation;

namespace LifeOrganizer.Application.Finances.Commands.Budget.GetBudgetWithUsage
{
    public class GetBudgetWithUsageValidator : AbstractValidator<GetBudgetWithUsageQuery>
    {
        public GetBudgetWithUsageValidator()
        {
            RuleFor(x => x.Month)
                .InclusiveBetween(1, 12);

            RuleFor(x => x.Year)
                .GreaterThan(2000);
        }
    }
}
