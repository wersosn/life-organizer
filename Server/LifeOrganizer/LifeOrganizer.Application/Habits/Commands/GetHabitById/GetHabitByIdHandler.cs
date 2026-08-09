using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Habits.Commands.GetHabitById
{
    public class GetHabitByIdHandler : IRequestHandler<GetHabitByIdQuery, HabitDetailsDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<GetHabitByIdHandler> _logger;

        public GetHabitByIdHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<GetHabitByIdHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task<HabitDetailsDto> Handle(GetHabitByIdQuery request, CancellationToken cancellationToken)
        {
            var habit = await _context.Habits.FirstOrDefaultAsync(x => x.Id == request.Id && x.UserId == _currentUser.UserId, cancellationToken);

            if (habit is null)
            {
                _logger.LogWarning("Habit not found.");
                throw new NotFoundException(nameof(habit), request.Id);
            }

            var cutoffDate = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(-90);
            var recentCompletions = await _context.HabitCompletions
                .Where(c => c.HabitId == habit.Id && c.Date >= cutoffDate)
                .OrderByDescending(c => c.Date)
                .Select(c => new HabitCompletionDto(c.Date, c.Status))
                .ToListAsync(cancellationToken);

            return new HabitDetailsDto(
                habit.Id,
                habit.Name,
                habit.Frequency,
                habit.ScheduledDays,
                habit.CompletionDeadline,
                habit.IsAutomationEnabled,
                recentCompletions
            );
        }
    }
}
