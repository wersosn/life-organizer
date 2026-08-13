namespace LifeOrganizer.Application.Common.Settings
{
    public class AutomationSettings
    {
        public int HabitCheckIntervalMinutes { get; set; } = 60; // 1h
        public int ChoreCheckIntervalMinutes { get; set; } = 60; // 1h
        public int CleanupCheckIntervalMinutes { get; set; } = 1440; // 24h
    }
}
