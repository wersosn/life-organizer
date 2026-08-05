using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Infrastructure.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Chores.Commands.Chore.GetChoreById
{
    public class GetChoreByIdHandler : IRequestHandler<GetChoreByIdQuery, ChoreDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GetChoreByIdHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<ChoreDto> Handle(GetChoreByIdQuery request, CancellationToken cancellationToken)
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
                throw new NotFoundException(nameof(Chore), request.Id);
            }

            var now = DateTime.UtcNow;
            var isOverdue = ChoreOverdueCalculator.IsOverdue(chore.LastCompletedAt, chore.FrequencyUnit, chore.FrequencyValue, now);

            return new ChoreDto(
                chore.Id, chore.Name, chore.Description, chore.CategoryId, chore.CategoryName,
                chore.FrequencyUnit, chore.FrequencyValue, chore.LastCompletedAt, chore.IsAutomationEnabled,
                isOverdue
            );
        }
    }
}
