using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Chores.Commands.ChoreCategories.UpdateChoreCategory
{
    public class UpdateChoreCategoryHandler : IRequestHandler<UpdateChoreCategoryCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public UpdateChoreCategoryHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(UpdateChoreCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await _context.ChoreCategories.FirstOrDefaultAsync(c => c.Id == request.Id && 
                c.UserId == _currentUser.UserId, 
                cancellationToken);

            if (category is null)
            {
                throw new NotFoundException(nameof(ChoreCategory), request.Id);
            }

            category.Name = request.Name;
            category.Icon = request.Icon;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
