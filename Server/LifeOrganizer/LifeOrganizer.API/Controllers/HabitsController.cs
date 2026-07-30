using LifeOrganizer.Application.Habits.Commands.CompleteHabit;
using LifeOrganizer.Application.Habits.Commands.CreateHabit;
using LifeOrganizer.Application.Habits.Commands.DeleteHabit;
using LifeOrganizer.Application.Habits.Commands.GetAllHabits;
using LifeOrganizer.Application.Habits.Commands.GetHabitById;
using LifeOrganizer.Application.Habits.Commands.UncompleteHabit;
using LifeOrganizer.Application.Habits.Commands.UpdateHabit;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeOrganizer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
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

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var habit = await mediator.Send(new GetHabitByIdQuery(id));
            return Ok(habit);
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

        [HttpPatch("{id:guid}/complete")]
        public async Task<IActionResult> Complete(Guid id, [FromQuery] DateOnly? date)
        {
            var completionId = await mediator.Send(new CompleteHabitCommand(id, date));
            return Ok(completionId);
        }

        [HttpPatch("{id:guid}/uncomplete")]
        public async Task<IActionResult> Uncomplete(Guid id, [FromQuery] DateOnly? date)
        {
            await mediator.Send(new UncompleteHabitCommand(id, date));
            return NoContent();
        }
    }
}
