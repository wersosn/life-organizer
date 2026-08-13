using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Retention.Commands.GetRetentionSettings
{
    public class GetRetentionSettingsHandler : IRequestHandler<GetRetentionSettingsQuery, RetentionSettingsDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GetRetentionSettingsHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<RetentionSettingsDto> Handle(GetRetentionSettingsQuery request, CancellationToken cancellationToken)
        {
            var days = await _context.Users
                .Where(u => u.Id == _currentUser.UserId)
                .Select(u => u.TaskHistoryRetentionDays)
                .FirstAsync(cancellationToken);

            return new RetentionSettingsDto(days);
        }
    }
}
