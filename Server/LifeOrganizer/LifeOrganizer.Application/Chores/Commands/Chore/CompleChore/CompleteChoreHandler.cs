using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Chores.Commands.Chore.CompleChore
{
    public class CompleteChoreHandler : IRequestHandler<CompleteChoreCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public CompleteChoreHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<Guid> Handle(CompleteChoreCommand request, CancellationToken cancellationToken)
        {
            var chore = await _context.Chores.FirstOrDefaultAsync(c => c.Id == request.ChoreId && 
                c.UserId == _currentUser.UserId, 
                cancellationToken);

            if (chore is null)
            {
                throw new NotFoundException(nameof(Chore), request.ChoreId);
            }

            var completion = new ChoreCompletion
            {
                Id = Guid.NewGuid(),
                ChoreId = chore.Id,
                CompletedAt = request.CompletedAt ?? DateTime.UtcNow,
                Notes = request.Notes,
            };

            _context.ChoreCompletions.Add(completion);

            if (chore.LastCompletedAt is null || completion.CompletedAt > chore.LastCompletedAt)
            {
                chore.LastCompletedAt = completion.CompletedAt;
                chore.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync(cancellationToken);
            return completion.Id;
        }
    }
}
