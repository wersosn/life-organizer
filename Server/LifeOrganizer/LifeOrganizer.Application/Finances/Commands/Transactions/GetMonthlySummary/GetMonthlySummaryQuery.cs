using MediatR;

namespace LifeOrganizer.Application.Finances.Commands.Transactions.GetMonthlySummary
{
    public record GetMonthlySummaryQuery(int Year, int Month) : IRequest<MonthlySummaryDto>;
}
