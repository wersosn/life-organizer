using LifeOrganizer.Application.Chores.Commands.ChoreCategories;
using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Application.Finances.Commands.Budget;
using LifeOrganizer.Application.Finances.Commands.TransactionCategories;
using MediatR;
using System.Text;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.Application.Export
{
    public class GetFullExportHandler : IRequestHandler<GetFullExportQuery, byte[]>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GetFullExportHandler(IApplicationDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<byte[]> Handle(GetFullExportQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;

            var user = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new UserExportDto(u.Email, u.Name, u.CreatedAt))
                .FirstAsync(cancellationToken);

            var todos = await _context.TodoItems
                .Where(t => t.UserId == userId)
                .Select(t => new TodoExportDto(t.Title, t.Description, t.IsCompleted, t.CreatedAt, t.CompletedAt, t.Source))
                .ToListAsync(cancellationToken);

            var habits = await _context.Habits
                .Where(h => h.UserId == userId)
                .Select(h => new HabitExportDto(
                    h.Name, h.Frequency, h.ScheduledDays, h.CompletionDeadline.HasValue ? DateTime.Today.Add(h.CompletionDeadline.Value) : null,
                    h.Completions.Select(c => new HabitCompletionExportDto(c.Date, c.Status)).ToList()))
                .ToListAsync(cancellationToken);

            var transactions = await _context.Transactions
                .Where(t => t.UserId == userId)
                .Select(t => new TransactionExportDto(t.Category.Name, t.Amount, t.Type, t.Description, t.Date))
                .ToListAsync(cancellationToken);

            var categories = await _context.TransactionCategories
                .Where(c => c.UserId == userId)
                .Select(c => new TransactionCategoryDto(c.Id, c.Name, c.Icon, c.Type))
                .ToListAsync(cancellationToken);

            var budgets = await _context.Budgets
                .Where(b => b.UserId == userId)
                .Select(b => new BudgetDto(b.Id, b.CategoryId, b.Category.Name, b.MonthlyLimit))
                .ToListAsync(cancellationToken);

            var chores = await _context.Chores
                .Where(c => c.UserId == userId)
                .Select(c => new ChoreExportDto(
                    c.Name, c.Category.Name, c.FrequencyUnit, c.FrequencyValue, c.LastCompletedAt,
                    c.Completions.Select(comp => new ChoreCompletionExportDto(comp.CompletedAt, comp.Notes)).ToList()))
                .ToListAsync(cancellationToken);

            var choreCategories = await _context.ChoreCategories
                .Where(c => c.UserId == userId)
                .Select(c => new ChoreCategoryDto(c.Id, c.Name, c.Icon))
                .ToListAsync(cancellationToken);

            var export = new FullExportDto(user, todos, habits, transactions, categories, budgets, chores, choreCategories, DateTime.UtcNow);

            var json = JsonSerializer.Serialize(export, new JsonSerializerOptions
            {
                WriteIndented = true,
                Converters = { new JsonStringEnumConverter() }
            });
            return Encoding.UTF8.GetBytes(json);
        }
    }
}
