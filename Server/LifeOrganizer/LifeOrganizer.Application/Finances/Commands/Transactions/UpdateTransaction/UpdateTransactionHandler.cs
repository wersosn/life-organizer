using FluentValidation;
using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.UpdateTransaction
{
    public class UpdateTransactionHandler : IRequestHandler<UpdateTransactionCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<UpdateTransactionHandler> _logger;

        public UpdateTransactionHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<UpdateTransactionHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task Handle(UpdateTransactionCommand request, CancellationToken cancellationToken)
        {
            var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == request.Id &&
                t.UserId == _currentUser.UserId,
                cancellationToken);

            if (transaction is null)
            {
                _logger.LogWarning("Transaction not found.");
                throw new NotFoundException(nameof(Transaction), request.Id);
            }

            var category = await _context.TransactionCategories.FirstOrDefaultAsync(c => c.Id == request.CategoryId &&
                c.UserId == _currentUser.UserId,
                cancellationToken);

            if (category is null)
            {
                _logger.LogWarning("Transaction update failed: category not found.");
                throw new NotFoundException(nameof(TransactionCategory), request.CategoryId);
            }

            if (category.Type != request.Type)
            {
                _logger.LogWarning("Transaction update failed: transaction type does not match category type.");
                throw new ValidationException(new[]
                {
                    new FluentValidation.Results.ValidationFailure(nameof(request.Type), "Transaction type must match the category's type.")
                });
            }

            transaction.CategoryId = request.CategoryId;
            transaction.Amount = request.Amount;
            transaction.Type = request.Type;
            transaction.Description = request.Description;
            transaction.Date = request.Date;
            transaction.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Transaction updated successfully. TransactionId: {TransactionId}", transaction.Id);
        }
    }
}
