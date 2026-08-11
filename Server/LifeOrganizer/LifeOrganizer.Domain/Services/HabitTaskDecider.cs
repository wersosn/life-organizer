using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Domain.Services
{
    public static class HabitTaskDecider
    {
        public static bool ShouldCreateTask(Habit habit, DateOnly today, DateTime now, HabitCompletionStatus? existingStatus, bool taskAlreadyExistsToday)
        {
            if (taskAlreadyExistsToday)
            {
                return false;
            }
            return HabitScheduleCalculator.IsMissed(habit, today, now, existingStatus);
        }
    }
}
