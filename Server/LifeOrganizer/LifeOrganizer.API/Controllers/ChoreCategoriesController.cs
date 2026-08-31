using Asp.Versioning;
using LifeOrganizer.Application.Chores.Commands.ChoreCategories.CreateChoreCategory;
using LifeOrganizer.Application.Chores.Commands.ChoreCategories.DeleteChoreCategory;
using LifeOrganizer.Application.Chores.Commands.ChoreCategories.GetAllChoreCategories;
using LifeOrganizer.Application.Chores.Commands.ChoreCategories.GetChoreCategoryById;
using LifeOrganizer.Application.Chores.Commands.ChoreCategories.UpdateChoreCategory;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeOrganizer.API.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Authorize]
    public class ChoreCategoriesController : ControllerBase
    {
        private readonly IMediator mediator;
        public ChoreCategoriesController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await mediator.Send(new GetAllChoreCategoriesQuery());
            return Ok(categories);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var category = await mediator.Send(new GetChoreCategoryByIdQuery(id));
            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateChoreCategoryCommand command)
        {
            var id = await mediator.Send(command);
            return Ok(id);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateChoreCategoryCommand command)
        {
            await mediator.Send(command with { Id = id });
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await mediator.Send(new DeleteChoreCategoryCommand(id));
            return NoContent();
        }
    }
}
