using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Chores.Commands.Chore.CompleteChore
{
    public class CompleteChoreHandler : IRequestHandler<CompleteChoreCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<CompleteChoreHandler> _logger;

        public CompleteChoreHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<CompleteChoreHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task<Guid> Handle(CompleteChoreCommand request, CancellationToken cancellationToken)
        {
            var chore = await _context.Chores.FirstOrDefaultAsync(c => c.Id == request.ChoreId && 
                c.UserId == _currentUser.UserId, 
                cancellationToken);

            if (chore is null)
            {
                _logger.LogWarning("Chore not found.");
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
            _logger.LogInformation("Chore completed successfully. ChoreId: {ChoreId}, CompletionId: {CompletionId}", chore.Id, completion.Id);
            return completion.Id;
        }
    }
}
