using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Automation.UpdateAutomationSettings
{
    public class UpdateAutomationSettingsHandler : IRequestHandler<UpdateAutomationSettingsCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<UpdateAutomationSettingsHandler> _logger;

        public UpdateAutomationSettingsHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<UpdateAutomationSettingsHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task Handle(UpdateAutomationSettingsCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstAsync(u => u.Id == _currentUser.UserId, cancellationToken);
            if (user is null)
            {
                _logger.LogWarning("Automation settings update failed: user not found.");
                throw new NotFoundException(nameof(User), _currentUser.UserId);
            }

            user.HabitAutomationEnabled = request.HabitAutomationEnabled;
            user.ChoreAutomationEnabled = request.ChoreAutomationEnabled;
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Automation settings updated successfully.");
        }
    }
}
