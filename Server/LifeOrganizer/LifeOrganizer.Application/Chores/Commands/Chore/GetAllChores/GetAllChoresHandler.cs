using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Infrastructure.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Chores.Commands.Chore.GetAllChores
{
    public class GetAllChoresHandler : IRequestHandler<GetAllChoresQuery, List<ChoreDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GetAllChoresHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<List<ChoreDto>> Handle(GetAllChoresQuery request, CancellationToken cancellationToken)
        {
            var chores = await _context.Chores
                .Where(c => c.UserId == _currentUser.UserId && c.IsActive)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description,
                    c.CategoryId,
                    CategoryName = c.Category.Name,
                    c.FrequencyUnit,
                    c.FrequencyValue,
                    c.LastCompletedAt,
                    c.IsAutomationEnabled,
                })
                .ToListAsync(cancellationToken);

            var now = DateTime.UtcNow;

            return chores
                .Select(c => new ChoreDto(
                    c.Id,
                    c.Name,
                    c.Description,
                    c.CategoryId,
                    c.CategoryName,
                    c.FrequencyUnit,
                    c.FrequencyValue,
                    c.LastCompletedAt,
                    c.IsAutomationEnabled,
                    ChoreOverdueCalculator.IsOverdue(c.LastCompletedAt, c.FrequencyUnit, c.FrequencyValue, now)
                ))
                .OrderByDescending(c => c.IsOverdue)
                .ToList();
        }
    }
}
