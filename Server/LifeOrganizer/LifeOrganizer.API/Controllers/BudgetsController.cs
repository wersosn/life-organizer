using Asp.Versioning;
using LifeOrganizer.Application.Finances.Commands.Budget.CreateBudget;
using LifeOrganizer.Application.Finances.Commands.Budget.DeleteBudget;
using LifeOrganizer.Application.Finances.Commands.Budget.GetAllBudgets;
using LifeOrganizer.Application.Finances.Commands.Budget.GetBudgetById;
using LifeOrganizer.Application.Finances.Commands.Budget.GetBudgetWithUsage;
using LifeOrganizer.Application.Finances.Commands.Budget.UpdateBudget;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeOrganizer.API.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Authorize]
    public class BudgetsController : ControllerBase
    {
        private readonly IMediator mediator;
        public BudgetsController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var budgets = await mediator.Send(new GetAllBudgetsQuery());
            return Ok(budgets);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var budget = await mediator.Send(new GetBudgetByIdQuery(id));
            return Ok(budget);
        }

        [HttpGet("usage")]
        public async Task<IActionResult> GetWithUsage([FromQuery] int year, [FromQuery] int month)
        {
            var result = await mediator.Send(new GetBudgetWithUsageQuery(year, month));
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateBudgetCommand command)
        {
            var id = await mediator.Send(command);
            return Ok(id);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateBudgetCommand command)
        {
            await mediator.Send(command with { Id = id });
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await mediator.Send(new DeleteBudgetCommand(id));
            return NoContent();
        }
    }
}
