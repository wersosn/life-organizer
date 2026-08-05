using FluentValidation;
using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Chores.Commands.ChoreCategories.DeleteChoreCategory
{
    public class DeleteChoreCategoryHandler : IRequestHandler<DeleteChoreCategoryCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public DeleteChoreCategoryHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(DeleteChoreCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await _context.ChoreCategories.FirstOrDefaultAsync(c => c.Id == request.Id &&
                c.UserId == _currentUser.UserId, 
                cancellationToken);

            if (category is null)
            {
                throw new NotFoundException(nameof(ChoreCategory), request.Id);
            }

            var hasChores = await _context.Chores.AnyAsync(c => c.CategoryId == category.Id, cancellationToken);

            if (hasChores)
            {
                throw new ValidationException(new[]
                {
                    new FluentValidation.Results.ValidationFailure(nameof(request.Id), "Cannot delete a category that has chores assigned to it.")
                });
            }

            _context.ChoreCategories.Remove(category);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
