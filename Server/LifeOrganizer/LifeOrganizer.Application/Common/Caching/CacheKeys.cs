namespace LifeOrganizer.Application.Common.Caching
{
    public static class CacheKeys
    {
        public static string UserPrefix(Guid userId) => $"user:{userId}:";

        public static string MonthlySummary(Guid userId, int year, int month) => $"{UserPrefix(userId)}summary:{year}-{month:D2}";

        public static string BudgetsUsage(Guid userId, int year, int month) => $"{UserPrefix(userId)}budgets-usage:{year}-{month:D2}";
    }
}
