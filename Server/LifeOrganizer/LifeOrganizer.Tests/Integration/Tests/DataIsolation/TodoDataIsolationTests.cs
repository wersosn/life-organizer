using LifeOrganizer.Application.Todo.Commands;
using System.Net.Http.Json;
using System.Net;

namespace LifeOrganizer.Tests.Integration.Tests.DataIsolation
{
    public class TodoDataIsolationTests : IntegrationTestBase
    {
        public TodoDataIsolationTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task GetAllTodos_ShouldNotReturnAnotherUsersTodos()
        {
            var createResponse = await Client.PostAsJsonAsync("/api/v1/todo", new
            {
                Id = Guid.NewGuid(),
                Title = "Private Todo",
            });
            Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);

            TestAuthHandler.CurrentUserId = Guid.NewGuid();

            var listResponse = await Client.GetAsync("/api/v1/todo");
            var todos = await listResponse.Content.ReadFromJsonAsync<List<TodoDto>>();

            Assert.DoesNotContain(todos!, t => t.Title == "Private Todo");
        }
    }
}
