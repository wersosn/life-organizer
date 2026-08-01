using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Finances.Commands.Budget.UpdateBudget
{
    public class UpdateBudgetHandler : IRequestHandler<UpdateBudgetCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public UpdateBudgetHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(UpdateBudgetCommand request, CancellationToken cancellationToken)
        {
            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == request.Id && 
                b.UserId == _currentUser.UserId, 
                cancellationToken);

            if (budget is null)
            {
                throw new NotFoundException(nameof(Budget), request.Id);
            }

            budget.MonthlyLimit = request.MonthlyLimit;
            budget.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
