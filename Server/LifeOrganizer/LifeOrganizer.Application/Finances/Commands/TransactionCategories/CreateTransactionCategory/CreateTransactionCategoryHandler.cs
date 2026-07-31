using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
namespace LifeOrganizer.Application.Finances.Commands.TransactionCategories.CreateTransactionCategory
{
    public class CreateTransactionCategoryHandler : IRequestHandler<CreateTransactionCategoryCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public CreateTransactionCategoryHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<Guid> Handle(CreateTransactionCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = new TransactionCategory
            {
                Id = Guid.NewGuid(),
                UserId = _currentUser.UserId,
                Name = request.Name,
                Icon = request.Icon,
                Type = request.Type,
                CreatedAt = DateTime.UtcNow,
            };

            _context.TransactionCategories.Add(category);
            await _context.SaveChangesAsync(cancellationToken);
            return category.Id;
        }
    }
}
