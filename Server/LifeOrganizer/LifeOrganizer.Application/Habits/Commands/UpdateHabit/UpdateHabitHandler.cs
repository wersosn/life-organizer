using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Habits.Commands.UpdateHabit
{
    public class UpdateHabitHandler : IRequestHandler<UpdateHabitCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<UpdateHabitHandler> _logger;

        public UpdateHabitHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<UpdateHabitHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task Handle(UpdateHabitCommand request, CancellationToken cancellationToken)
        {
            var habit = await _context.Habits.FirstOrDefaultAsync(x => x.Id == request.Id &&
                    x.UserId == _currentUser.UserId,
                    cancellationToken);

            if (habit is null)
            {
                _logger.LogWarning("Habit not found.");
                throw new NotFoundException(nameof(habit), request.Id);
            }

            habit.Name = request.Name;
            habit.Frequency = request.Frequency;
            habit.ScheduledDays = request.ScheduledDays;
            habit.CompletionDeadline = request.CompletionDeadline;
            habit.IsAutomationEnabled = request.IsAutomationEnabled;
            habit.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Habit updated successfully. HabitId: {HabitId}", habit.Id);
        }
    }   
}
