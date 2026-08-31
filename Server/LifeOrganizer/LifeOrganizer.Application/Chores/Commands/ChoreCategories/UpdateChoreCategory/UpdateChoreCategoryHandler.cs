using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Chores.Commands.ChoreCategories.UpdateChoreCategory
{
    public class UpdateChoreCategoryHandler : IRequestHandler<UpdateChoreCategoryCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<UpdateChoreCategoryHandler> _logger;

        public UpdateChoreCategoryHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<UpdateChoreCategoryHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task Handle(UpdateChoreCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await _context.ChoreCategories.FirstOrDefaultAsync(c => c.Id == request.Id && 
                c.UserId == _currentUser.UserId, 
                cancellationToken);

            if (category is null)
            {
                _logger.LogWarning("Chore category not found.");
                throw new NotFoundException(nameof(ChoreCategory), request.Id);
            }

            category.Name = request.Name;
            category.Icon = request.Icon;
            category.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Chore category updated successfully. CategoryId: {CategoryId}", category.Id);
        }
    }
}
