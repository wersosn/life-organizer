using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.UpdateTransaction
{
    public class UpdateTransactionHandler : IRequestHandler<UpdateTransactionCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public UpdateTransactionHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(UpdateTransactionCommand request, CancellationToken cancellationToken)
        {
            var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == request.Id &&
                t.UserId == _currentUser.UserId,
                cancellationToken);

            if (transaction is null)
            {
                throw new NotFoundException(nameof(Transaction), request.Id);
            }

            var categoryExists = await _context.TransactionCategories
                .AnyAsync(c => c.Id == request.CategoryId && c.UserId == _currentUser.UserId, cancellationToken);

            if (!categoryExists)
            {
                throw new NotFoundException(nameof(TransactionCategory), request.CategoryId);
            }

            transaction.CategoryId = request.CategoryId;
            transaction.Amount = request.Amount;
            transaction.Type = request.Type;
            transaction.Description = request.Description;
            transaction.Date = request.Date;
            transaction.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
