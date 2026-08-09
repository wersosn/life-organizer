using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Habits.Commands.GetAllHabits
{
    public class GetAllHabitsHandler : IRequestHandler<GetAllHabitsQuery, List<HabitDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GetAllHabitsHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }
        public async Task<List<HabitDto>> Handle(GetAllHabitsQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            return await _context.Habits
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new HabitDto
                (
                    x.Id,
                    x.Name,
                    x.Frequency,
                    x.ScheduledDays,
                    x.CompletionDeadline,                    
                    x.IsActive,
                    x.CreatedAt,
                    x.IsAutomationEnabled,
                    x.Completions.Any(c => c.Date == today && c.Status == HabitCompletionStatus.Completed)
                ))
                .ToListAsync(cancellationToken);
        }

    }
}
