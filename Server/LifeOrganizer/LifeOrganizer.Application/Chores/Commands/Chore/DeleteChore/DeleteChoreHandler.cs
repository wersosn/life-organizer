using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Chores.Commands.Chore.DeleteChore
{
    public class DeleteChoreHandler : IRequestHandler<DeleteChoreCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public DeleteChoreHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(DeleteChoreCommand request, CancellationToken cancellationToken)
        {
            var chore = await _context.Chores.FirstOrDefaultAsync(c => c.Id == request.Id && 
                c.UserId == _currentUser.UserId, 
                cancellationToken);

            if (chore is null)
            {
                throw new NotFoundException(nameof(Chore), request.Id);
            }

            // soft delete for later:
            //chore.IsActive = false;
            //chore.UpdatedAt = DateTime.UtcNow;

            _context.Chores.Remove(chore);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
