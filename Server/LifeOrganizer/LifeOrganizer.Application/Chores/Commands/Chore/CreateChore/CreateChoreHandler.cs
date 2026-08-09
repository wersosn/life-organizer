using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Chores.Commands.Chore.CreateChore
{
    public class CreateChoreHandler : IRequestHandler<CreateChoreCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<CreateChoreHandler> _logger;

        public CreateChoreHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<CreateChoreHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task<Guid> Handle(CreateChoreCommand request, CancellationToken cancellationToken)
        {
            var categoryExists = await _context.ChoreCategories.AnyAsync(c => c.Id == request.CategoryId && 
                c.UserId == _currentUser.UserId, 
                cancellationToken);

            if (!categoryExists)
            {
                _logger.LogWarning("Chore creation failed: category not found.");
                throw new NotFoundException(nameof(ChoreCategory), request.CategoryId);
            }

            var chore = new LifeOrganizer.Domain.Entities.Chore
            {
                Id = Guid.NewGuid(),
                UserId = _currentUser.UserId,
                Name = request.Name,
                Description = request.Description,
                CategoryId = request.CategoryId,
                FrequencyUnit = request.FrequencyUnit,
                FrequencyValue = request.FrequencyValue,
                LastCompletedAt = null,
                IsAutomationEnabled = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            _context.Chores.Add(chore);
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Chore created successfully. ChoreId: {ChoreId}", chore.Id);
            return chore.Id;
        }
    }
}
