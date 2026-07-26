using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Habits.Commands.CompleteHabit
{
    public class CompleteHabitHandler : IRequestHandler<CompleteHabitCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public CompleteHabitHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<Guid> Handle(CompleteHabitCommand request, CancellationToken cancellationToken)
        {
            var habit = await _context.Habits.FirstOrDefaultAsync(x => x.Id == request.Id &&
                    x.UserId == _currentUser.UserId,
                    cancellationToken);

            if (habit is null)
            {
                throw new NotFoundException(nameof(Habit), request.Id);
            }

            var targetDate = request.Date ?? DateOnly.FromDateTime(DateTime.UtcNow);
            var completion = await _context.HabitCompletions.FirstOrDefaultAsync(c => c.HabitId == habit.Id && c.Date == targetDate, cancellationToken);

            if (completion is null)
            {
                completion = new HabitCompletion
                {
                    Id = Guid.NewGuid(),
                    HabitId = habit.Id,
                    Date = targetDate,
                    Status = HabitCompletionStatus.Completed,
                    CompletedAt = DateTime.UtcNow,
                };
                _context.HabitCompletions.Add(completion);
            }
            else
            {
                completion.Status = HabitCompletionStatus.Completed;
                completion.CompletedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync(cancellationToken);
            return completion.Id;
        }
    }
}
