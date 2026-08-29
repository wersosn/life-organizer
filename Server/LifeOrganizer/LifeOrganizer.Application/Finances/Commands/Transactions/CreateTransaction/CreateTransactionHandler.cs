using FluentValidation;
using LifeOrganizer.Application.Common.Caching;
using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.CreateTransaction
{
    public class CreateTransactionHandler : IRequestHandler<CreateTransactionCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ICacheService _cacheService;
        private readonly ILogger<CreateTransactionHandler> _logger;

        public CreateTransactionHandler(IApplicationDbContext context, ICurrentUserService currentUser, ICacheService cacheService, ILogger<CreateTransactionHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _cacheService = cacheService;
            _logger = logger;
        }

        public async Task<Guid> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
        {
            var category = await _context.TransactionCategories.FirstOrDefaultAsync(c => c.Id == request.CategoryId && 
                c.UserId == _currentUser.UserId, 
                cancellationToken);

            if (category is null)
            {
                _logger.LogWarning("Transaction creation failed: category not found.");
                throw new NotFoundException(nameof(TransactionCategory), request.CategoryId);
            }

            if (category.Type != request.Type)
            {
                _logger.LogWarning("Transaction creation failed: transaction type does not match category type.");
                throw new ValidationException(new[]
                {
                    new FluentValidation.Results.ValidationFailure(nameof(request.Type), "Transaction type must match the category's type.")
                });
            }

            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = _currentUser.UserId,
                CategoryId = request.CategoryId,
                Amount = request.Amount,
                Type = request.Type,
                Description = request.Description,
                Date = request.Date,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync(cancellationToken);

            _cacheService.RemoveByPrefix(CacheKeys.UserPrefix(_currentUser.UserId));

            _logger.LogInformation("Transaction created successfully. TransactionId: {TransactionId}", transaction.Id);
            return transaction.Id;
        }
    }
}
