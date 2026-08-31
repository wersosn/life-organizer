using Asp.Versioning;
using LifeOrganizer.Application.Finances.Commands.TransactionCategories.CreateTransactionCategory;
using LifeOrganizer.Application.Finances.Commands.TransactionCategories.DeleteTransactionCategory;
using LifeOrganizer.Application.Finances.Commands.TransactionCategories.GetAllTransactionCategories;
using LifeOrganizer.Application.Finances.Commands.TransactionCategories.GetTransactionCategoryById;
using LifeOrganizer.Application.Finances.Commands.TransactionCategories.UpdateTransactionCategory;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeOrganizer.API.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Authorize]
    public class TransactionCategoriesController : ControllerBase
    {
        private readonly IMediator mediator;
        public TransactionCategoriesController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await mediator.Send(new GetAllTransactionCategoriesQuery());
            return Ok(categories);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var category = await mediator.Send(new GetTransactionCategoryByIdQuery(id));
            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTransactionCategoryCommand command)
        {
            var id = await mediator.Send(command);
            return Ok(id);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateTransactionCategoryCommand command)
        {
            await mediator.Send(command with { Id = id });
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await mediator.Send(new DeleteTransactionCategoryCommand(id));
            return NoContent();
        }
    }
}
