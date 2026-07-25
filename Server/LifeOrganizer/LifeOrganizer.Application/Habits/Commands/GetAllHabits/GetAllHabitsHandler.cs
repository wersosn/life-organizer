using LifeOrganizer.Application.Common.Interfaces;
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
            return await _context.Habits
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new HabitDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Frequency = x.Frequency,
                    ScheduledDays = x.ScheduledDays,
                    CompletionDeadline = x.CompletionDeadline,
                    IsActive = x.IsActive,
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync(cancellationToken);
        }

    }
}
