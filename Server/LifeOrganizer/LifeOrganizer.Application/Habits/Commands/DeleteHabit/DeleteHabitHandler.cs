using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Habits.Commands.DeleteHabit
{
    public class DeleteHabitHandler : IRequestHandler<DeleteHabitCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public DeleteHabitHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(DeleteHabitCommand request, CancellationToken cancellationToken)
        {
            var habit = await _context.Habits.FirstOrDefaultAsync(x => x.Id == request.Id &&
                    x.UserId == _currentUser.UserId,
                    cancellationToken);

            if (habit is null)
            {
                throw new NotFoundException(nameof(Habit), request.Id);
            }

            _context.Habits.Remove(habit);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
