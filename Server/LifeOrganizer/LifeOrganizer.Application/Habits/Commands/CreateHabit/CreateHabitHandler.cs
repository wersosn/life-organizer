using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Todo.Commands.CreateTodo;
using LifeOrganizer.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Habits.Commands.CreateHabit
{
    public class CreateHabitHandler : IRequestHandler<CreateHabitCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public CreateHabitHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
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
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync(cancellationToken);
            return habit.Id;
        }
    }
}
