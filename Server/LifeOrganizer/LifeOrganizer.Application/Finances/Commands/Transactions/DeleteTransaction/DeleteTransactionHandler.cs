using LifeOrganizer.Application.Common.Caching;
using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.DeleteTransaction
{
    public class DeleteTransactionHandler : IRequestHandler<DeleteTransactionCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ICacheService _cacheService;
        private readonly ILogger<DeleteTransactionHandler> _logger;

        public DeleteTransactionHandler(IApplicationDbContext context, ICurrentUserService currentUser, ICacheService cacheService, ILogger<DeleteTransactionHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _cacheService = cacheService;
            _logger = logger;
        }

        public async Task Handle(DeleteTransactionCommand request, CancellationToken cancellationToken)
        {
            var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == request.Id &&
                t.UserId == _currentUser.UserId,
                cancellationToken);

            if (transaction is null)
            {
                _logger.LogWarning("Transaction not found.");
                throw new NotFoundException(nameof(Transaction), request.Id);
            }

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync(cancellationToken);

            _cacheService.RemoveByPrefix(CacheKeys.UserPrefix(_currentUser.UserId));

            _logger.LogInformation("Transaction deleted successfully. TransactionId: {TransactionId}", transaction.Id);
        }
    }
}
