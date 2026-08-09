using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Chores.Commands.Chore.UpdateChore
{
    public class UpdateChoreHandler : IRequestHandler<UpdateChoreCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<UpdateChoreHandler> _logger;

        public UpdateChoreHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<UpdateChoreHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task Handle(UpdateChoreCommand request, CancellationToken cancellationToken)
        {
            var chore = await _context.Chores.FirstOrDefaultAsync(c => c.Id == request.Id && 
                c.UserId == _currentUser.UserId, 
                cancellationToken);

            if (chore is null)
            {
                _logger.LogWarning("Chore not found.");
                throw new NotFoundException(nameof(Chore), request.Id);
            }

            var categoryExists = await _context.ChoreCategories.AnyAsync(c => c.Id == request.CategoryId && 
                c.UserId == _currentUser.UserId, 
                cancellationToken);

            if (!categoryExists)
            {
                _logger.LogWarning("Chore update failed: category not found.");
                throw new NotFoundException(nameof(ChoreCategory), request.CategoryId);
            }

            chore.Name = request.Name;
            chore.Description = request.Description;
            chore.CategoryId = request.CategoryId;
            chore.FrequencyUnit = request.FrequencyUnit;
            chore.FrequencyValue = request.FrequencyValue;
            chore.IsAutomationEnabled = request.IsAutomationEnabled;
            chore.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Chore updated successfully. ChoreId: {ChoreId}", chore.Id);
        }
    }
}
