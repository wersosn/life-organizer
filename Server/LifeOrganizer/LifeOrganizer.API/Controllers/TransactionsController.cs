using Asp.Versioning;
using LifeOrganizer.Application.Finances.Commands.Transactions.CreateTransaction;
using LifeOrganizer.Application.Finances.Commands.Transactions.DeleteTransaction;
using LifeOrganizer.Application.Finances.Commands.Transactions.ExportTransaction;
using LifeOrganizer.Application.Finances.Commands.Transactions.GetAllTransactions;
using LifeOrganizer.Application.Finances.Commands.Transactions.GetMonthlySummary;
using LifeOrganizer.Application.Finances.Commands.Transactions.GetTransactionById;
using LifeOrganizer.Application.Finances.Commands.Transactions.UpdateTransaction;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeOrganizer.API.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Authorize]
    public class TransactionsController : ControllerBase
    {
        private readonly IMediator mediator;
        public TransactionsController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] DateOnly? from, [FromQuery] DateOnly? to)
        {
            var transactions = await mediator.Send(new GetAllTransactionsQuery(from, to));
            return Ok(transactions);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var transaction = await mediator.Send(new GetTransactionByIdQuery(id));
            return Ok(transaction);
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetMonthlySummary([FromQuery] int year, [FromQuery] int month)
        {
            var summary = await mediator.Send(new GetMonthlySummaryQuery(year, month));
            return Ok(summary);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTransactionCommand command)
        {
            var id = await mediator.Send(command);
            return Ok(id);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateTransactionCommand command)
        {
            await mediator.Send(command with { Id = id });
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await mediator.Send(new DeleteTransactionCommand(id));
            return NoContent();
        }

        [HttpGet("export")]
        public async Task<IActionResult> Export([FromQuery] DateOnly? from, [FromQuery] DateOnly? to)
        {
            var csvBytes = await mediator.Send(new ExportTransactionsQuery(from, to));
            var fileName = $"transactions_{DateTime.UtcNow:yyyyMMdd}.csv";
            return File(csvBytes, "text/csv", fileName);
        }
    }
}
