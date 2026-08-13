using LifeOrganizer.Domain.Entities;

namespace LifeOrganizer.Domain.Services
{
    public static class TaskRetentionCalculator
    {
        public static bool ShouldDelete(TodoItem task, int retentionDays, DateTime now)
        {
            if (!task.IsCompleted || task.CompletedAt is null)
            {
                return false;
            }
            return task.CompletedAt.Value.AddDays(retentionDays) < now;
        }
    }
}
