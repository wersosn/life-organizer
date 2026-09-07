using LifeOrganizer.Application.Todo.Commands;
using System.Net.Http.Json;
using System.Net;

namespace LifeOrganizer.Tests.Integration.Tests.Flow
{
    public class TodoFlowTests : IntegrationTestBase
    {
        public TodoFlowTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task FullFlow_CreateUpdateCompleteDelete_ShouldWorkEndToEnd()
        {
            // Create:
            var createResponse = await Client.PostAsJsonAsync("/api/v1/todo", new
            {
                Id = Guid.NewGuid(),
                Title = "Buy groceries",
                Description = "Milk, eggs, bread"
            });
            Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
            var todoId = await createResponse.Content.ReadFromJsonAsync<Guid>();

            // Show todos:
            var listResponse = await Client.GetAsync("/api/v1/todo");
            Assert.Equal(HttpStatusCode.OK, listResponse.StatusCode);
            var todos = await listResponse.Content.ReadFromJsonAsync<List<TodoDto>>();
            Assert.Contains(todos!, t => t.Id == todoId && t.Title == "Buy groceries");

            // Update:
            var updateResponse = await Client.PutAsJsonAsync($"/api/v1/todo/{todoId}", new
            {
                Title = "Buy groceries and cook",
                Description = "Milk, eggs, bread, pasta"
            });
            Assert.Equal(HttpStatusCode.NoContent, updateResponse.StatusCode);

            var completeResponse = await Client.PatchAsync($"/api/v1/todo/{todoId}/complete", null);
            Assert.Equal(HttpStatusCode.NoContent, completeResponse.StatusCode);
            
            // Show todos after update:
            var listAfterCompleteResponse = await Client.GetAsync("/api/v1/todo");
            var todosAfter = await listAfterCompleteResponse.Content.ReadFromJsonAsync<List<TodoDto>>();
            var updatedTodo = todosAfter!.First(t => t.Id == todoId);
            Assert.Equal("Buy groceries and cook", updatedTodo.Title);
            Assert.True(updatedTodo.IsCompleted);

            // Delete:
            var deleteResponse = await Client.DeleteAsync($"/api/v1/todo/{todoId}");
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

            // Show todos after deleting a todo:
            var listAfterDeleteResponse = await Client.GetAsync("/api/v1/todo");
            var todosAfterDelete = await listAfterDeleteResponse.Content.ReadFromJsonAsync<List<TodoDto>>();
            Assert.DoesNotContain(todosAfterDelete!, t => t.Id == todoId);
        }

        [Fact]
        public async Task GetAllTodos_ShouldNotReturnAnotherUsersTodos()
        {
            var createResponse = await Client.PostAsJsonAsync("/api/v1/todo", new
            {
                Id = Guid.NewGuid(),
                Title = "Private task",
            });
            Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);

            TestAuthHandler.CurrentUserId = Guid.NewGuid();

            var listResponse = await Client.GetAsync("/api/v1/todo");
            var todos = await listResponse.Content.ReadFromJsonAsync<List<TodoDto>>();

            Assert.DoesNotContain(todos!, t => t.Title == "Private task");
        }
    }
}
