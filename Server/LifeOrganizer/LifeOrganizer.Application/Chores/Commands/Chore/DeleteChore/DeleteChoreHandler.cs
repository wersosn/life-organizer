using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Chores.Commands.Chore.DeleteChore
{
    public class DeleteChoreHandler : IRequestHandler<DeleteChoreCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<DeleteChoreHandler> _logger;

        public DeleteChoreHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<DeleteChoreHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task Handle(DeleteChoreCommand request, CancellationToken cancellationToken)
        {
            var chore = await _context.Chores.FirstOrDefaultAsync(c => c.Id == request.Id && 
                c.UserId == _currentUser.UserId, 
                cancellationToken);

            if (chore is null)
            {
                _logger.LogWarning("Chore not found.");
                throw new NotFoundException(nameof(Chore), request.Id);
            }

            // soft delete for later:
            //chore.IsActive = false;
            //chore.UpdatedAt = DateTime.UtcNow;

            _context.Chores.Remove(chore);
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Chore deleted successfully. ChoreId: {ChoreId}", chore.Id);
        }
    }
}
