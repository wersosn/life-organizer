using LifeOrganizer.Application.Habits.Commands.CreateHabit;
using LifeOrganizer.Application.Habits.Commands.DeleteHabit;
using LifeOrganizer.Application.Habits.Commands.GetAllHabits;
using LifeOrganizer.Application.Habits.Commands.UpdateHabit;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeOrganizer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class HabitsController : ControllerBase
    {
        private readonly IMediator mediator;
        public HabitsController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var habits = await mediator.Send(new GetAllHabitsQuery());
            return Ok(habits);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateHabitCommand command)
        {
            var id = await mediator.Send(command);
            return Ok(id);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateHabitCommand command)
        {
            await mediator.Send(command with { Id = id });
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await mediator.Send(new DeleteHabitCommand(id));
            return NoContent();
        }
    }
}
