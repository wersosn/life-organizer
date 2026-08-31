using Asp.Versioning;
using LifeOrganizer.Application.Todo.Commands.CompleteTodo;
using LifeOrganizer.Application.Todo.Commands.CreateTodo;
using LifeOrganizer.Application.Todo.Commands.DeleteTodo;
using LifeOrganizer.Application.Todo.Commands.GetAllTodo;
using LifeOrganizer.Application.Todo.Commands.GetTodoById;
using LifeOrganizer.Application.Todo.Commands.UpdateTodo;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeOrganizer.API.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Authorize]
    public class TodoController : ControllerBase
    {
        private readonly IMediator mediator;
        public TodoController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var todos = await mediator.Send(new GetAllTodosQuery());
            return Ok(todos);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var todo = await mediator.Send(new GetTodoByIdQuery(id));
            return Ok(todo);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTodoCommand command)
        {
            var id = await mediator.Send(command);
            return Ok(id);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateTodoCommand command)
        {
            await mediator.Send(command with { Id = id });
            return NoContent();
        }

        [HttpPatch("{id:guid}/complete")]
        public async Task<IActionResult> Complete(Guid id)
        {
            await mediator.Send(new CompleteTodoCommand(id));
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await mediator.Send(new DeleteTodoCommand(id));
            return NoContent();
        }
    }
}
