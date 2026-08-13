using LifeOrganizer.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Retention.Commands.UpdateRetentionSettings
{
    public class UpdateRetentionSettingsHandler : IRequestHandler<UpdateRetentionSettingsCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<UpdateRetentionSettingsHandler> _logger;

        public UpdateRetentionSettingsHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<UpdateRetentionSettingsHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task Handle(UpdateRetentionSettingsCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstAsync(u => u.Id == _currentUser.UserId, cancellationToken);
            user.TaskHistoryRetentionDays = request.TaskHistoryRetentionDays;
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Task history retention settings updated successfully.");
        }
    }
}
