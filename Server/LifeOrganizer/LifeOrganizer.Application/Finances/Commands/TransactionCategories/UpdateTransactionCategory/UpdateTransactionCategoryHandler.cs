using FluentValidation;
using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Finances.Commands.TransactionCategories.UpdateTransactionCategory
{
    public class UpdateTransactionCategoryHandler : IRequestHandler<UpdateTransactionCategoryCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public UpdateTransactionCategoryHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(UpdateTransactionCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await _context.TransactionCategories.FirstOrDefaultAsync(c => c.Id == request.Id && 
                c.UserId == _currentUser.UserId, 
                cancellationToken);

            if (category is null)
            {
                throw new NotFoundException(nameof(TransactionCategory), request.Id);
            }

            if (category.Type != request.Type)
            {
                var hasTransactions = await _context.Transactions.AnyAsync(t => t.CategoryId == category.Id, cancellationToken);

                if (hasTransactions)
                {
                    throw new ValidationException(new[]
                    {
                        new FluentValidation.Results.ValidationFailure(nameof(request.Type), "Cannot change the type of a category that already has transactions assigned to it")
                    });
                }
            }

            category.Name = request.Name;
            category.Icon = request.Icon;
            category.Type = request.Type;
            category.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
