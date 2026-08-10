using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Domain.Services
{
    public class HabitScheduleCalculator
    {
        public static bool IsScheduledFor(Habit habit, DateOnly date)
        {
            if (habit.Frequency == HabitFrequency.Daily)
            {
                return true;
            }
            var dayOfWeek = date.DayOfWeek;
            return habit.ScheduledDays.Contains(dayOfWeek);
        }

        public static DateTime GetDeadlineMoment(Habit habit, DateOnly date)
        {
            if (habit.CompletionDeadline.HasValue)
            {
                return date.ToDateTime(TimeOnly.FromTimeSpan(habit.CompletionDeadline.Value));
            }
            return date.ToDateTime(new TimeOnly(23, 59, 59)); // no explicit deadline - occurs at the end of the day by default
        }

        public static bool IsMissed(Habit habit, DateOnly date, DateTime now, HabitCompletionStatus? existingStatus)
        {
            if (!IsScheduledFor(habit, date))
            {
                return false;
            }

            if (existingStatus == HabitCompletionStatus.Completed)
            {
                return false;
            }
            return now >= GetDeadlineMoment(habit, date);
        }
    }
}
