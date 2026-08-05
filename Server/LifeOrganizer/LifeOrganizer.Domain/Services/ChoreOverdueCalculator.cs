using LifeOrganizer.Domain.Enums;

namespace LifeOrganizer.Infrastructure.Services
{
    public static class ChoreOverdueCalculator
    {
        public static bool IsOverdue(DateTime? lastCompletedAt, ChoreFrequency unit, int value, DateTime now)
        {
            if (lastCompletedAt is null)
            {
                return true;
            }

            var dueDate = unit switch
            {
                ChoreFrequency.Days => lastCompletedAt.Value.AddDays(value),
                ChoreFrequency.Weeks => lastCompletedAt.Value.AddDays(value * 7),
                ChoreFrequency.Months => lastCompletedAt.Value.AddMonths(value),
                _ => throw new NotSupportedException()
            };
            return now > dueDate;
        }
    }
}
