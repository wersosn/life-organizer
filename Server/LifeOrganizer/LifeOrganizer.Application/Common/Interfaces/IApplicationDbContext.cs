using LifeOrganizer.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<User> Users { get; }
        DbSet<TodoItem> TodoItems { get; }
        DbSet<Habit> Habits { get; }
        DbSet<HabitCompletion> HabitCompletions { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
