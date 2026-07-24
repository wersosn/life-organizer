using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Tests.Helpers
{
    public static class TestDbContextFactory
    {
        public static AppDbContext Create()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }
    }
}
