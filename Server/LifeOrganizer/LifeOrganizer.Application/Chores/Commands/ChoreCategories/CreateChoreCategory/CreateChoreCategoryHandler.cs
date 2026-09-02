using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Chores.Commands.ChoreCategories.CreateChoreCategory
{
    public class CreateChoreCategoryHandler : IRequestHandler<CreateChoreCategoryCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<CreateChoreCategoryHandler> _logger;

        public CreateChoreCategoryHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<CreateChoreCategoryHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task<Guid> Handle(CreateChoreCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = new ChoreCategory
            {
                Id = request.Id,
                UserId = _currentUser.UserId,
                Name = request.Name,
                Icon = request.Icon,
                CreatedAt = DateTime.UtcNow,
            };

            _context.ChoreCategories.Add(category);
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Chore category created successfully. CategoryId: {CategoryId}", category.Id);
            return category.Id;
        }
    }
}
