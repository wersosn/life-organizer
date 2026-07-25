using LifeOrganizer.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Domain.Entities
{
    public class HabitCompletion
    {
        public Guid Id { get; set; }
        public Guid HabitId { get; set; }
        public Habit Habit { get; set; } = null!;
        public DateOnly Date { get; set; }
        public HabitCompletionStatus Status { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
