using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Chores.Commands.Chore.UncompleteChore
{
    public class UncompleteChoreHandler : IRequestHandler<UncompleteChoreCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<UncompleteChoreHandler> _logger;

        public UncompleteChoreHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<UncompleteChoreHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task Handle(UncompleteChoreCommand request, CancellationToken cancellationToken)
        {
            var chore = await _context.Chores.FirstOrDefaultAsync(c => c.Id == request.Id &&
                c.UserId == _currentUser.UserId, 
                cancellationToken);

            if (chore is null)
            {
                _logger.LogWarning("Chore not found.");
                throw new NotFoundException(nameof(Chore), request.Id);
            }

            var lastCompletion = await _context.ChoreCompletions
                .Where(c => c.ChoreId == chore.Id)
                .OrderByDescending(c => c.CompletedAt)
                .FirstOrDefaultAsync(cancellationToken);

            if (lastCompletion is null)
            {
                return;
            }

            _context.ChoreCompletions.Remove(lastCompletion);

            var newLastCompletion = await _context.ChoreCompletions
                .Where(c => c.ChoreId == chore.Id && c.Id != lastCompletion.Id)
                .OrderByDescending(c => c.CompletedAt)
                .FirstOrDefaultAsync(cancellationToken);

            chore.LastCompletedAt = newLastCompletion?.CompletedAt;
            chore.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Chore marked as incomplete. ChoreId: {ChoreId}, CompletionId: {CompletionId}", chore.Id, lastCompletion.Id);
        }
    }
}
