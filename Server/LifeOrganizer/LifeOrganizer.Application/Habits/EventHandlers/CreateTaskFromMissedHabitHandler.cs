using LifeOrganizer.Application.Common.Events;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using MediatR;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Habits.EventHandlers
{
    public class CreateTaskFromMissedHabitHandler : INotificationHandler<HabitMissedEvent>
    {
        private readonly IApplicationDbContext _context;
        private readonly ILogger<CreateTaskFromMissedHabitHandler> _logger;

        public CreateTaskFromMissedHabitHandler(IApplicationDbContext context, ILogger<CreateTaskFromMissedHabitHandler> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task Handle(HabitMissedEvent notification, CancellationToken cancellationToken)
        {
            _context.TodoItems.Add(new TodoItem
            {
                Id = Guid.NewGuid(),
                UserId = notification.UserId,
                Title = notification.HabitName,
                Source = TaskSource.HabitAutomation,
                SourceId = notification.HabitId,
                CreatedAt = DateTime.UtcNow,
                IsCompleted = false,
            });

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Task created from missed habit {HabitId}", notification.HabitId);
        }
    }
}
