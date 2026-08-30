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

namespace LifeOrganizer.Tests.Unit.BackgroundServices.ChoreAutomation
{
    public class ChoreAutomationPublishingTests
    {
        private readonly ITestOutputHelper output;
        public ChoreAutomationPublishingTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task RunCheckOnce_ShouldPublishChoreOverdueEvent_ForOverdueChore()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var user = new User { Id = userId, Email = "a@a.com", Name = "A", PasswordHash = "h", ChoreAutomationEnabled = true };
            var chore = new Chore
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Take out trash",
                LastCompletedAt = DateTime.UtcNow.AddDays(-10),
                FrequencyUnit = ChoreFrequency.Days,
                FrequencyValue = 7,
                IsActive = true,
                IsAutomationEnabled = true,
            };
            context.Users.Add(user);
            context.Chores.Add(chore);
            await context.SaveChangesAsync();

            var publisherMock = new Mock<IPublisher>();
            var scopeFactory = TestScopeFactory.Create(context, publisherMock.Object);

            var service = new ChoreAutomationService(scopeFactory, NullLogger<ChoreAutomationService>.Instance, TestOptionsFactory.Create(new AutomationSettings()));
            await service.RunCheckOnceAsync();

            publisherMock.Verify(p => p.Publish(
                It.Is<ChoreOverdueEvent>(e => e.ChoreId == chore.Id && e.UserId == userId),
                It.IsAny<CancellationToken>()), Times.Once);

            output.WriteLine("ChoreOverdueEvent published for overdue chore");
        }

        [Fact]
        public async Task RunCheckOnce_ShouldNotPublishEvent_WhenTaskAlreadyExistsAndIncomplete()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var user = new User { Id = userId, Email = "a@a.com", Name = "A", PasswordHash = "h", ChoreAutomationEnabled = true };
            var chore = new Chore
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Take out trash",
                LastCompletedAt = DateTime.UtcNow.AddDays(-10),
                FrequencyUnit = ChoreFrequency.Days,
                FrequencyValue = 7,
                IsActive = true,
                IsAutomationEnabled = true,
            };
            context.Users.Add(user);
            context.Chores.Add(chore);
            context.TodoItems.Add(new TodoItem
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = "Take out trash",
                Source = TaskSource.ChoreAutomation,
                SourceId = chore.Id,
                CreatedAt = DateTime.UtcNow,
                IsCompleted = false,
            });
            await context.SaveChangesAsync();

            var publisherMock = new Mock<IPublisher>();
            var scopeFactory = TestScopeFactory.Create(context, publisherMock.Object);

            var service = new ChoreAutomationService(scopeFactory, NullLogger<ChoreAutomationService>.Instance, TestOptionsFactory.Create(new AutomationSettings()));
            await service.RunCheckOnceAsync();

            publisherMock.Verify(p => p.Publish(It.IsAny<ChoreOverdueEvent>(), It.IsAny<CancellationToken>()), Times.Never);

            output.WriteLine("Correctly skipped publishing - incomplete task already exists");
        }
    }
}
