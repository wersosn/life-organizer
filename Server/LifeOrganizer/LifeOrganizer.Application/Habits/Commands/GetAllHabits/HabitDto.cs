using LifeOrganizer.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Habits.Commands.GetAllHabits
{
    public class HabitDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public HabitFrequency Frequency { get; set; }
        public List<DayOfWeek> ScheduledDays { get; set; } = new List<DayOfWeek>();
        public TimeSpan? CompletionDeadline { get; set; }
        public bool IsAutomationEnabled { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
