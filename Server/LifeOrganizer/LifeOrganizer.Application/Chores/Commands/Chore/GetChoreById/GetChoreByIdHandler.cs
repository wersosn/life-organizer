using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Chores.Commands.Chore.GetChoreById
{
    public class GetChoreByIdHandler : IRequestHandler<GetChoreByIdQuery, ChoreDetailsDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<GetChoreByIdHandler> _logger;

        public GetChoreByIdHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<GetChoreByIdHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task<ChoreDetailsDto> Handle(GetChoreByIdQuery request, CancellationToken cancellationToken)
        {
            var chore = await _context.Chores
                .Where(c => c.Id == request.Id && c.UserId == _currentUser.UserId)
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
                .FirstOrDefaultAsync(cancellationToken);

            if (chore is null)
            {
                _logger.LogWarning("Chore not found.");
                throw new NotFoundException(nameof(Chore), request.Id);
            }

            var recentCompletions = await _context.ChoreCompletions
                .Where(c => c.ChoreId == chore.Id)
                .OrderByDescending(c => c.CompletedAt)
                .Take(20)
                .Select(c => new ChoreCompletionDto(c.Id, c.CompletedAt, c.Notes))
                .ToListAsync(cancellationToken);

            var now = DateTime.UtcNow;
            var isOverdue = ChoreOverdueCalculator.IsOverdue(chore.LastCompletedAt, chore.FrequencyUnit, chore.FrequencyValue, now); 

            return new ChoreDetailsDto(
                chore.Id,
                chore.Name,
                chore.Description,
                chore.CategoryId,
                chore.CategoryName,
                chore.FrequencyUnit,
                chore.FrequencyValue,
                chore.LastCompletedAt,
                chore.IsAutomationEnabled,
                isOverdue,
                recentCompletions
            );
        }
    }
}
