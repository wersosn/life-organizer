using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Finances.Commands.Budget.GetBudgetById
{
    public class GetBudgetByIdHandler : IRequestHandler<GetBudgetByIdQuery, BudgetDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<GetBudgetByIdHandler> _logger;

        public GetBudgetByIdHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<GetBudgetByIdHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task<BudgetDto> Handle(GetBudgetByIdQuery request, CancellationToken cancellationToken)
        {
            var budget = await _context.Budgets
                .Where(b => b.Id == request.Id && b.UserId == _currentUser.UserId)
                .Select(b => new BudgetDto(b.Id, b.CategoryId, b.Category.Name, b.MonthlyLimit))
                .FirstOrDefaultAsync(cancellationToken);

            if (budget is null)
            {
                _logger.LogWarning("Budget not found.");
                throw new NotFoundException(nameof(Budget), request.Id);
            }
            return budget;
        }
    }
}
