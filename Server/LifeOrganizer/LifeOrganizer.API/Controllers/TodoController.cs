using LifeOrganizer.Application.Todo.Commands.CreateTodo;
using LifeOrganizer.Application.Todo.Commands.GetAllTodo;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeOrganizer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly IMediator mediator;
        public TodoController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var todos = await mediator.Send(new GetAllTodosQuery());
            return Ok(todos);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTodoCommand command)
        {
            var id = await mediator.Send(command);
            return Ok(id);
        }
    }
}
