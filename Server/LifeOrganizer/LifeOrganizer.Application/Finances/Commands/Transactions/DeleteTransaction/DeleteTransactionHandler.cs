using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.DeleteTransaction
{
    public class DeleteTransactionHandler : IRequestHandler<DeleteTransactionCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public DeleteTransactionHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(DeleteTransactionCommand request, CancellationToken cancellationToken)
        {
            var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == request.Id &&
                t.UserId == _currentUser.UserId,
                cancellationToken);

            if (transaction is null)
            {
                throw new NotFoundException(nameof(Transaction), request.Id);
            }

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
