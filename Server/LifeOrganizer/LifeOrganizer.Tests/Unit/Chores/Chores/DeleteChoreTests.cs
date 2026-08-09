using LifeOrganizer.Application.Chores.Commands.Chore.CreateChore;
using LifeOrganizer.Application.Chores.Commands.Chore.DeleteChore;
using LifeOrganizer.Application.Chores.Commands.Chore.GetAllChores;
using LifeOrganizer.Application.Chores.Commands.ChoreCategories.DeleteChoreCategory;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using LifeOrganizer.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.Chores.Chores
{
    public class DeleteChoreTests
    {
        private readonly ITestOutputHelper output;
        public DeleteChoreTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public async Task DeleteChore_ShouldRemoveChoreFromDatabase()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();
            var category = new ChoreCategory
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Kitchen"
            };
            context.ChoreCategories.Add(category);

            var chore = new Chore
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CategoryId = category.Id,
                Name = "Wash dishes",
                FrequencyUnit = ChoreFrequency.Days,
                FrequencyValue = 1,
                IsActive = true
            };
            context.Chores.Add(chore);
            await context.SaveChangesAsync();

            var handler = new DeleteChoreHandler(context, new FakeCurrentUserService(userId), NullLogger<DeleteChoreHandler>.Instance);
            await handler.Handle(new DeleteChoreCommand(chore.Id), CancellationToken.None);
            Assert.Empty(await context.Chores.ToListAsync());

            output.WriteLine("Chore deleted successfully");
        }

        [Fact]
        public async Task DeleteChore_ShouldAlsoRemoveRelatedCompletions()
        {
            var context = TestDbContextFactory.Create();
            var userId = Guid.NewGuid();

            var category = new ChoreCategory 
            { 
                Id = Guid.NewGuid(), 
                UserId = userId, 
                Name = "Kitchen" 
            };

            var chore = new Chore
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CategoryId = category.Id,
                Name = "Wash dishes",
                FrequencyUnit = ChoreFrequency.Days,
                FrequencyValue = 1,
                IsActive = true
            };

            var completion = new ChoreCompletion
            {
                Id = Guid.NewGuid(),
                ChoreId = chore.Id,
                CompletedAt = DateTime.UtcNow
            };

            context.ChoreCategories.Add(category);
            context.Chores.Add(chore);
            context.ChoreCompletions.Add(completion);
            await context.SaveChangesAsync();

            var handler = new DeleteChoreHandler(context, new FakeCurrentUserService(userId), NullLogger<DeleteChoreHandler>.Instance);
            await handler.Handle(new DeleteChoreCommand(chore.Id), CancellationToken.None);
            Assert.Empty(await context.ChoreCompletions.ToListAsync());

            output.WriteLine("Related chore completions removed via cascade delete");
        }
    }
}
