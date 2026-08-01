using LifeOrganizer.Application.Common.Events;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeOrganizer.Application.Finances.EventHandlers
{
    public class SeedDefaultCategoriesOnUserRegistered : INotificationHandler<UserRegisteredEvent>
    {
        private readonly IApplicationDbContext _context;

        private static readonly (string Name, TransactionType Type)[] DefaultCategories =
        {
            ("Food", TransactionType.Expense),
            ("Transport", TransactionType.Expense),
            ("Housing", TransactionType.Expense),
            ("Entertainment", TransactionType.Expense),
            ("Salary", TransactionType.Income),
            ("Other", TransactionType.Expense),
        };

        public SeedDefaultCategoriesOnUserRegistered(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(UserRegisteredEvent notification, CancellationToken cancellationToken)
        {
            foreach (var (name, type) in DefaultCategories)
            {
                _context.TransactionCategories.Add(new TransactionCategory
                {
                    Id = Guid.NewGuid(),
                    UserId = notification.UserId,
                    Name = name,
                    Type = type,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                });
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
