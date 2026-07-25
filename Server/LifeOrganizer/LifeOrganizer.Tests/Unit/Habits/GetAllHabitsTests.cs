using LifeOrganizer.Application.Habits.Commands.GetAllHabits;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Tests.Helpers;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Habits
{
    public class GetAllHabitsTests
    {
        private readonly ITestOutputHelper output;
        public GetAllHabitsTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task GetAllHabits_ShouldReturnOnlyCurrentUserHabits()
        {
            var context = TestDbContextFactory.Create();
            var user1 = Guid.NewGuid();
            var user2 = Guid.NewGuid();

            context.Habits.AddRange(
                new Habit
                {
                    Id = Guid.NewGuid(),
                    UserId = user1,
                    Name = "User 1 habit",
                    Frequency = Domain.Enums.HabitFrequency.Daily,
                    IsActive = true
                },

                new Habit
                {
                    Id = Guid.NewGuid(),
                    UserId = user2,
                    Name = "User 2 habit",
                    Frequency = Domain.Enums.HabitFrequency.Weekly,
                    IsActive = true
                }
            );

            await context.SaveChangesAsync();

            var handler = new GetAllHabitsHandler(
                context,
                new FakeCurrentUserService(user1)
            );

            var result = await handler.Handle(
                new GetAllHabitsQuery(),
                CancellationToken.None
            );

            Assert.Single(result);
            Assert.Equal(
                "User 1 habit",
                result.First().Name
            );

            output.WriteLine("Successfully showed only current user habits");
        }
    }
}
