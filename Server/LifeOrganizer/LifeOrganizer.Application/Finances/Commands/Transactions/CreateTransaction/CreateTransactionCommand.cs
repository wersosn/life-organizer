using LifeOrganizer.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.CreateTransaction
{
    public record CreateTransactionCommand(Guid CategoryId, decimal Amount, TransactionType Type, string? Description, DateOnly Date) : IRequest<Guid>;
}
