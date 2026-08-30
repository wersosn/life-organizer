using LifeOrganizer.Application.Common.Events;
using LifeOrganizer.Application.Common.Settings;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Infrastructure.BackgroundServices;
using LifeOrganizer.Tests.Helpers;
using MediatR;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.BackgroundServices.HabitAutomation
{
    public class HabitAutomationPublishingTests
    {
        private readonly ITestOutputHelper output;
        public HabitAutomationPublishingTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task RunCheckOnce_ShouldPublishHabitMissedEvent_ForOverdueHabit()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var user = new User { Id = userId, Email = "a@a.com", Name = "A", PasswordHash = "h", HabitAutomationEnabled = true };
            var habit = new Habit
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Meditation",
                Frequency = HabitFrequency.Daily,
                CompletionDeadline = new TimeSpan(1, 0, 0), // 01:00 UTC
                IsActive = true,
                IsAutomationEnabled = true,
            };
            context.Users.Add(user);
            context.Habits.Add(habit);
            await context.SaveChangesAsync();

            var publisherMock = new Mock<IPublisher>();
            var scopeFactory = TestScopeFactory.Create(context, publisherMock.Object);

            var service = new HabitAutomationService(scopeFactory, NullLogger<HabitAutomationService>.Instance, TestOptionsFactory.Create(new AutomationSettings()));
            await service.RunCheckOnceAsync();

            publisherMock.Verify(p => p.Publish(
                It.Is<HabitMissedEvent>(e => e.HabitId == habit.Id && e.UserId == userId),
                It.IsAny<CancellationToken>()), Times.Once);

            output.WriteLine("HabitMissedEvent published for overdue habit");
        }

        [Fact]
        public async Task RunCheckOnce_ShouldNotPublishEvent_WhenTaskAlreadyExistsToday()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var user = new User { Id = userId, Email = "a@a.com", Name = "A", PasswordHash = "h", HabitAutomationEnabled = true };
            var habit = new Habit
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Meditation",
                Frequency = HabitFrequency.Daily,
                CompletionDeadline = new TimeSpan(1, 0, 0),
                IsActive = true,
                IsAutomationEnabled = true,
            };
            context.Users.Add(user);
            context.Habits.Add(habit);
            context.TodoItems.Add(new TodoItem
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = "Meditation",
                Source = TaskSource.HabitAutomation,
                SourceId = habit.Id,
                CreatedAt = DateTime.UtcNow,
            });
            await context.SaveChangesAsync();

            var publisherMock = new Mock<IPublisher>();
            var scopeFactory = TestScopeFactory.Create(context, publisherMock.Object);

            var service = new HabitAutomationService(scopeFactory, NullLogger<HabitAutomationService>.Instance, TestOptionsFactory.Create(new AutomationSettings()));
            await service.RunCheckOnceAsync();

            publisherMock.Verify(p => p.Publish(It.IsAny<HabitMissedEvent>(), It.IsAny<CancellationToken>()), Times.Never);

            output.WriteLine("Correctly skipped publishing — task already exists today");
        }
    }
}
