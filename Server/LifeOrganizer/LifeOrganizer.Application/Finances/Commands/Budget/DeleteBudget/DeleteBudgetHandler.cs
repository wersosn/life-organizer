using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Finances.Commands.Budget.DeleteBudget
{
    public class DeleteBudgetHandler : IRequestHandler<DeleteBudgetCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<DeleteBudgetHandler> _logger;

        public DeleteBudgetHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<DeleteBudgetHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task Handle(DeleteBudgetCommand request, CancellationToken cancellationToken)
        {
            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == request.Id && 
                b.UserId == _currentUser.UserId, 
                cancellationToken);

            if (budget is null)
            {
                _logger.LogWarning("Budget not found.");
                throw new NotFoundException(nameof(Budget), request.Id);
            }

            _context.Budgets.Remove(budget);
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Budget deleted successfully. BudgetId: {BudgetId}", budget.Id);
        }
    }
}
