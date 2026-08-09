using LifeOrganizer.Application.Common.Exceptions;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeOrganizer.Application.Finances.Commands.TransactionCategories.GetTransactionCategoryById
{
    public class GetTransactionCategoryByIdHandler : IRequestHandler<GetTransactionCategoryByIdQuery, TransactionCategoryDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;
        private readonly ILogger<GetTransactionCategoryByIdHandler> _logger;

        public GetTransactionCategoryByIdHandler(IApplicationDbContext context, ICurrentUserService currentUser, ILogger<GetTransactionCategoryByIdHandler> logger)
        {
            _context = context;
            _currentUser = currentUser;
            _logger = logger;
        }

        public async Task<TransactionCategoryDto> Handle(GetTransactionCategoryByIdQuery request, CancellationToken cancellationToken)
        {
            var category = await _context.TransactionCategories
                .Where(c => c.Id == request.Id && c.UserId == _currentUser.UserId)
                .Select(c => new TransactionCategoryDto(c.Id, c.Name, c.Icon, c.Type))
                .FirstOrDefaultAsync(cancellationToken);

            if (category is null)
            {
                _logger.LogWarning("Transaction category not found.");
                throw new NotFoundException(nameof(TransactionCategory), request.Id);
            }
            return category;
        }
    }
}
