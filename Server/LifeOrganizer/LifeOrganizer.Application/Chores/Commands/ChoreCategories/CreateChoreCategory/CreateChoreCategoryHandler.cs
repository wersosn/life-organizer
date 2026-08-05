using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;

namespace LifeOrganizer.Application.Chores.Commands.ChoreCategories.CreateChoreCategory
{
    public class CreateChoreCategoryHandler : IRequestHandler<CreateChoreCategoryCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public CreateChoreCategoryHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<Guid> Handle(CreateChoreCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = new ChoreCategory
            {
                Id = Guid.NewGuid(),
                UserId = _currentUser.UserId,
                Name = request.Name,
                Icon = request.Icon,
                CreatedAt = DateTime.UtcNow,
            };

            _context.ChoreCategories.Add(category);
            await _context.SaveChangesAsync(cancellationToken);
            return category.Id;
        }
    }
}
