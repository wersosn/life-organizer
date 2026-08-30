using LifeOrganizer.Application.Common.Events;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using MediatR;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Chores.EventHandlers
{
    public class CreateTaskFromOverdueChoreHandler : INotificationHandler<ChoreOverdueEvent>
    {
        private readonly IApplicationDbContext _context;
        private readonly ILogger<CreateTaskFromOverdueChoreHandler> _logger;

        public CreateTaskFromOverdueChoreHandler(IApplicationDbContext context, ILogger<CreateTaskFromOverdueChoreHandler> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task Handle(ChoreOverdueEvent notification, CancellationToken cancellationToken)
        {
            _context.TodoItems.Add(new TodoItem
            {
                Id = Guid.NewGuid(),
                UserId = notification.UserId,
                Title = notification.ChoreName,
                Source = TaskSource.ChoreAutomation,
                SourceId = notification.ChoreId,
                CreatedAt = DateTime.UtcNow,
                IsCompleted = false,
            });

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Task created from overdue chore {ChoreId}", notification.ChoreId);
        }
    }
}
