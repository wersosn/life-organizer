using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Habits.Commands.CreateHabit
{
    public class CreateHabitHandler : IRequestHandler<CreateHabitCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<CreateHabitHandler> _logger;

        public CreateHabitHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<CreateHabitHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task<Guid> Handle(CreateHabitCommand request, CancellationToken cancellationToken)
        {
            var habit = new Habit
            {
                Id = Guid.NewGuid(),
                UserId = _currentUser.UserId,
                Name = request.Name,
                Frequency = request.Frequency,
                ScheduledDays = request.ScheduledDays,
                CompletionDeadline = request.CompletionDeadline,
                IsAutomationEnabled = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Habit created successfully. HabitId: {HabitId}", habit.Id);
            return habit.Id;
        }
    }
}
