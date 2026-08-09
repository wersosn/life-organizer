using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Habits.Commands.UncompleteHabit
{
    public class UncompleteHabitHandler : IRequestHandler<UncompleteHabitCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<UncompleteHabitHandler> _logger;

        public UncompleteHabitHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<UncompleteHabitHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task Handle(UncompleteHabitCommand request, CancellationToken cancellationToken)
        {
            var habit = await _context.Habits.FirstOrDefaultAsync(x => x.Id == request.Id &&
                    x.UserId == _currentUser.UserId,
                    cancellationToken);

            if (habit is null)
            {
                _logger.LogWarning("Habit not found.");
                throw new NotFoundException(nameof(Habit), request.Id);
            }

            var targetDate = request.Date ?? DateOnly.FromDateTime(DateTime.UtcNow);
            var completion = await _context.HabitCompletions.FirstOrDefaultAsync(c => c.HabitId == habit.Id && c.Date == targetDate, cancellationToken);

            if (completion is not null && completion.Status == HabitCompletionStatus.Completed)
            {
                _context.HabitCompletions.Remove(completion);
                await _context.SaveChangesAsync(cancellationToken);
                _logger.LogInformation("Habit marked as incomplete. HabitId: {HabitId}, Date: {Date}", habit.Id, targetDate);
            }
        }
    }
}
