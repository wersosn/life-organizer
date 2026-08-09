using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Habits.Commands.DeleteHabit
{
    public class DeleteHabitHandler : IRequestHandler<DeleteHabitCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<DeleteHabitHandler> _logger;

        public DeleteHabitHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<DeleteHabitHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task Handle(DeleteHabitCommand request, CancellationToken cancellationToken)
        {
            var habit = await _context.Habits.FirstOrDefaultAsync(x => x.Id == request.Id &&
                    x.UserId == _currentUser.UserId,
                    cancellationToken);

            if (habit is null)
            {
                _logger.LogWarning("Habit not found.");
                throw new NotFoundException(nameof(Habit), request.Id);
            }

            _context.Habits.Remove(habit);
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Habit deleted successfully. HabitId: {HabitId}", habit.Id);
        }
    }
}
