using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Chores.Commands.Chore.UncompleteChore
{
    public class UncompleteChoreHandler : IRequestHandler<UncompleteChoreCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public UncompleteChoreHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(UncompleteChoreCommand request, CancellationToken cancellationToken)
        {
            var chore = await _context.Chores.FirstOrDefaultAsync(c => c.Id == request.Id &&
                c.UserId == _currentUser.UserId, 
                cancellationToken);

            if (chore is null)
            {
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
        }
    }
}
