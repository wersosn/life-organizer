using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;
namespace LifeOrganizer.Application.Finances.Commands.TransactionCategories.CreateTransactionCategory
{
    public class CreateTransactionCategoryHandler : IRequestHandler<CreateTransactionCategoryCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<CreateTransactionCategoryHandler> _logger;

        public CreateTransactionCategoryHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<CreateTransactionCategoryHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task<Guid> Handle(CreateTransactionCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = new TransactionCategory
            {
                Id = request.Id,
                UserId = _currentUser.UserId,
                Name = request.Name,
                Icon = request.Icon,
                Type = request.Type,
                CreatedAt = DateTime.UtcNow,
            };

            _context.TransactionCategories.Add(category);
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Transaction category created successfully. CategoryId: {CategoryId}", category.Id);
            return category.Id;
        }
    }
}
