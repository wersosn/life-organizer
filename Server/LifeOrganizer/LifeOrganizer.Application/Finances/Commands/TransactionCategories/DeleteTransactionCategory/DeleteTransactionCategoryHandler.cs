using FluentValidation;
using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Finances.Commands.TransactionCategories.DeleteTransactionCategory
{
    public class DeleteTransactionCategoryHandler : IRequestHandler<DeleteTransactionCategoryCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public DeleteTransactionCategoryHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(DeleteTransactionCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await _context.TransactionCategories.FirstOrDefaultAsync(c => c.Id == request.Id && 
                c.UserId == _currentUser.UserId, 
                cancellationToken);

            if (category is null)
            {
                throw new NotFoundException(nameof(TransactionCategory), request.Id);
            }

            var hasTransactions = await _context.Transactions.AnyAsync(t => t.CategoryId == category.Id, cancellationToken);
            if (hasTransactions)
            {
                throw new ValidationException(new[]
                {
                    new FluentValidation.Results.ValidationFailure(nameof(request.Id), "Cannot delete a category that has transactions assigned to it")
                });
            }

            var hasBudget = await _context.Budgets.AnyAsync(b => b.CategoryId == category.Id, cancellationToken);
            if (hasBudget)
            {
                var budget = await _context.Budgets.FirstAsync(b => b.CategoryId == category.Id, cancellationToken);
                _context.Budgets.Remove(budget);
            }

            _context.TransactionCategories.Remove(category);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
