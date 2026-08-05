using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Chores.Commands.Chore.CreateChore
{
    public class CreateChoreHandler : IRequestHandler<CreateChoreCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public CreateChoreHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<Guid> Handle(CreateChoreCommand request, CancellationToken cancellationToken)
        {
            var categoryExists = await _context.ChoreCategories.AnyAsync(c => c.Id == request.CategoryId && 
                c.UserId == _currentUser.UserId, 
                cancellationToken);

            if (!categoryExists)
            {
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
            return chore.Id;
        }
    }
}
