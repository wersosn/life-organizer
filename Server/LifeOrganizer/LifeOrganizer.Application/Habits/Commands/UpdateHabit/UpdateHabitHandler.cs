using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Habits.Commands.UpdateHabit
{
    public class UpdateHabitHandler : IRequestHandler<UpdateHabitCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public UpdateHabitHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(UpdateHabitCommand request, CancellationToken cancellationToken)
        {
            var habit = await _context.Habits.FirstOrDefaultAsync(x => x.Id == request.Id &&
                    x.UserId == _currentUser.UserId,
                    cancellationToken);

            if (habit is null)
            {
                throw new NotFoundException(nameof(habit), request.Id);
            }

            habit.Name = request.Name;
            habit.Frequency = request.Frequency;
            habit.ScheduledDays = request.ScheduledDays;
            habit.CompletionDeadline = request.CompletionDeadline;
            habit.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
