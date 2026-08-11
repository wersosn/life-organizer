using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Infrastructure.Services;

namespace LifeOrganizer.Domain.Services
{
    public class ChoreTaskDecider
    {
        public static bool ShouldCreateTask(Chore chore, DateTime now, bool hasOpenAutomationTask)
        {
            if (hasOpenAutomationTask)
            {
                return false;
            }
            return ChoreOverdueCalculator.IsOverdue(chore.LastCompletedAt, chore.FrequencyUnit, chore.FrequencyValue, now);
        }
    }
}
