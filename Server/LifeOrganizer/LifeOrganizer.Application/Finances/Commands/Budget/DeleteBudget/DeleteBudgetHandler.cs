using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Finances.Commands.Budget.DeleteBudget
{
    public class DeleteBudgetHandler : IRequestHandler<DeleteBudgetCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public DeleteBudgetHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(DeleteBudgetCommand request, CancellationToken cancellationToken)
        {
            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == request.Id && 
                b.UserId == _currentUser.UserId, 
                cancellationToken);

            if (budget is null)
            {
                throw new NotFoundException(nameof(Budget), request.Id);
            }

            _context.Budgets.Remove(budget);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
