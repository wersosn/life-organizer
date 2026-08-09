using FluentValidation;
using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Chores.Commands.ChoreCategories.DeleteChoreCategory
{
    public class DeleteChoreCategoryHandler : IRequestHandler<DeleteChoreCategoryCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<DeleteChoreCategoryHandler> _logger;

        public DeleteChoreCategoryHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<DeleteChoreCategoryHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task Handle(DeleteChoreCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await _context.ChoreCategories.FirstOrDefaultAsync(c => c.Id == request.Id &&
                c.UserId == _currentUser.UserId, 
                cancellationToken);

            if (category is null)
            {
                _logger.LogWarning("Chore category not found.");
                throw new NotFoundException(nameof(ChoreCategory), request.Id);
            }

            var hasChores = await _context.Chores.AnyAsync(c => c.CategoryId == category.Id, cancellationToken);

            if (hasChores)
            {
                _logger.LogWarning("Chore category deletion failed: category has assigned chores. CategoryId: {CategoryId}", category.Id);
                throw new ValidationException(new[]
                {
                    new FluentValidation.Results.ValidationFailure(nameof(request.Id), "Cannot delete a category that has chores assigned to it.")
                });
            }

            _context.ChoreCategories.Remove(category);
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Chore category deleted successfully. CategoryId: {CategoryId}", category.Id);
        }
    }
}
