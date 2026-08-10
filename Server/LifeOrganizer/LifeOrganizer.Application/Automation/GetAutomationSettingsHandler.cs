using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Automation
{
    public class GetAutomationSettingsHandler : IRequestHandler<GetAutomationSettingsQuery, AutomationSettingsDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GetAutomationSettingsHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<AutomationSettingsDto> Handle(GetAutomationSettingsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Users
                .Where(u => u.Id == _currentUser.UserId)
                .Select(u => new AutomationSettingsDto(u.HabitAutomationEnabled, u.ChoreAutomationEnabled))
                .FirstAsync(cancellationToken);
        }
    }
}
