using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.GetTransactionById
{
    public class GetTransactionByIdHandler : IRequestHandler<GetTransactionByIdQuery, TransactionDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GetTransactionByIdHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<TransactionDto> Handle(GetTransactionByIdQuery request, CancellationToken cancellationToken)
        {
            var transaction = await _context.Transactions
                .Where(t => t.Id == request.Id && t.UserId == _currentUser.UserId)
                .Select(t => new TransactionDto(
                    t.Id,
                    t.CategoryId,
                    t.Category.Name,
                    t.Amount,
                    t.Type,
                    t.Description,
                    t.Date))
                .FirstOrDefaultAsync(cancellationToken);

            if (transaction is null)
            {
                throw new NotFoundException(nameof(Transaction), request.Id);
            }
            return transaction;
        }
    }
}
