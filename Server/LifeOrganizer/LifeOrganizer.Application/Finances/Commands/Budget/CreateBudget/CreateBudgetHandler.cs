using FluentValidation;
using LifeOrganizer.Application.Common.Caching;
using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Finances.Commands.Budget.CreateBudget
{
    public class CreateBudgetHandler : IRequestHandler<CreateBudgetCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ICacheService _cacheService;
        private readonly ILogger<CreateBudgetHandler> _logger;

        public CreateBudgetHandler(IApplicationDbContext context, ICurrentUserService currentUser, ICacheService cacheService, ILogger<CreateBudgetHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _cacheService = cacheService;
            _logger = logger;
        }

        public async Task<Guid> Handle(CreateBudgetCommand request, CancellationToken cancellationToken)
        {
            var categoryExists = await _context.TransactionCategories
                .AnyAsync(c => c.Id == request.CategoryId && c.UserId == _currentUser.UserId, cancellationToken);

            if (!categoryExists)
            {
                _logger.LogWarning("Budget creation failed: transaction category not found.");
                throw new NotFoundException(nameof(TransactionCategory), request.CategoryId);
            }

            var alreadyExists = await _context.Budgets.AnyAsync(b => b.UserId == _currentUser.UserId && 
                b.CategoryId == request.CategoryId, 
                cancellationToken);

            if (alreadyExists)
            {
                _logger.LogWarning("Budget creation failed: budget for the category already exists.");
                throw new ValidationException(new[]
                {
                    new FluentValidation.Results.ValidationFailure(nameof(request.CategoryId), "A budget for this category already exists.")
                });
            }

            var budget = new LifeOrganizer.Domain.Entities.Budget
            {
                Id = Guid.NewGuid(),
                UserId = _currentUser.UserId,
                CategoryId = request.CategoryId,
                MonthlyLimit = request.MonthlyLimit,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync(cancellationToken);

            _cacheService.RemoveByPrefix(CacheKeys.UserPrefix(_currentUser.UserId));

            _logger.LogInformation("Budget created successfully. BudgetId: {BudgetId}", budget.Id);
            return budget.Id;
        }
    }
}
