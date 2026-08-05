using LifeOrganizer.Application.Chores.Commands.Chore.GetAllChores;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Chores.Chores
{
    public class GetAllChoresTests
    {
        private readonly ITestOutputHelper output;
        public GetAllChoresTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetAllChores_ShouldCorrectlyFlagOverdueAndUpcomingChores()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var category = new ChoreCategory { Id = Guid.NewGuid(), UserId = userId, Name = "Kitchen" };
            context.ChoreCategories.Add(category);

            context.Chores.AddRange(
                // never done -> obverdue
                new Chore
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    CategoryId = category.Id,
                    Name = "Never done",
                    FrequencyUnit = ChoreFrequency.Days,
                    FrequencyValue = 7,
                    LastCompletedAt = null,
                    IsActive = true
                },
                // done 10 days ago, frequency = 7 days -> overdue
                new Chore
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    CategoryId = category.Id,
                    Name = "Overdue",
                    FrequencyUnit = ChoreFrequency.Days,
                    FrequencyValue = 7,
                    LastCompletedAt = DateTime.UtcNow.AddDays(-10),
                    IsActive = true
                },
                // done 2 days ago, frequency = 7 days -> not overdue
                new Chore
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    CategoryId = category.Id,
                    Name = "Up to date",
                    FrequencyUnit = ChoreFrequency.Days,
                    FrequencyValue = 7,
                    LastCompletedAt = DateTime.UtcNow.AddDays(-2),
                    IsActive = true
                },
                // not active - should not include
                new Chore
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    CategoryId = category.Id,
                    Name = "Archived",
                    FrequencyUnit = ChoreFrequency.Days,
                    FrequencyValue = 1,
                    LastCompletedAt = null,
                    IsActive = false
                }
            );
            await context.SaveChangesAsync();

            var handler = new GetAllChoresHandler(context, new FakeCurrentUserService(userId));

            var result = await handler.Handle(new GetAllChoresQuery(), CancellationToken.None);
            Assert.Equal(3, result.Count);

            var neverDone = result.First(c => c.Name == "Never done");
            var overdue = result.First(c => c.Name == "Overdue");
            var upToDate = result.First(c => c.Name == "Up to date");

            Assert.True(neverDone.IsOverdue);
            Assert.True(overdue.IsOverdue);
            Assert.False(upToDate.IsOverdue);
            Assert.True(result[0].IsOverdue);

            output.WriteLine("Correctly identified overdue, upcoming, and inactive chores");
        }
    }
}
