using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Finances.Commands.Budget.UpdateBudget
{
    public class UpdateBudgetHandler : IRequestHandler<UpdateBudgetCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<UpdateBudgetHandler> _logger;

        public UpdateBudgetHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<UpdateBudgetHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task Handle(UpdateBudgetCommand request, CancellationToken cancellationToken)
        {
            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == request.Id && 
                b.UserId == _currentUser.UserId, 
                cancellationToken);

            if (budget is null)
            {
                _logger.LogWarning("Budget not found.");
                throw new NotFoundException(nameof(Budget), request.Id);
            }

            budget.MonthlyLimit = request.MonthlyLimit;
            budget.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Budget updated successfully. BudgetId: {BudgetId}", budget.Id);
        }
    }
}
