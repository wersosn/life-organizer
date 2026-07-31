using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.CreateTransaction
{
    public class CreateTransactionHandler : IRequestHandler<CreateTransactionCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public CreateTransactionHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<Guid> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
        {
            var categoryExists = await _context.TransactionCategories.AnyAsync(c => c.Id == request.CategoryId && c.UserId == _currentUser.UserId, cancellationToken);
            if (!categoryExists)
            {
                throw new NotFoundException(nameof(TransactionCategory), request.CategoryId);
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
            return transaction.Id;
        }
    }
}
