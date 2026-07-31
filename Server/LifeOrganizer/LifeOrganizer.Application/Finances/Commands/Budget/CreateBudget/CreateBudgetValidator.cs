using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
