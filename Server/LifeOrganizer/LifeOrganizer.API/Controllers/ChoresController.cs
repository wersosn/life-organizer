using LifeOrganizer.Application.Chores.Commands.Chore.CreateChore;
using LifeOrganizer.Application.Chores.Commands.Chore.DeleteChore;
using LifeOrganizer.Application.Chores.Commands.Chore.GetAllChores;
using LifeOrganizer.Application.Chores.Commands.Chore.GetChoreById;
using LifeOrganizer.Application.Chores.Commands.Chore.UpdateChore;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeOrganizer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChoresController : ControllerBase
    {
        private readonly IMediator mediator;
        public ChoresController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var chores = await mediator.Send(new GetAllChoresQuery());
            return Ok(chores);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var chore = await mediator.Send(new GetChoreByIdQuery(id));
            return Ok(chore);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateChoreCommand command)
        {
            var id = await mediator.Send(command);
            return Ok(id);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateChoreCommand command)
        {
            await mediator.Send(command with { Id = id });
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await mediator.Send(new DeleteChoreCommand(id));
            return NoContent();
        }
    }
}
