namespace LifeOrganizer.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public bool EmailConfirmed { get; set; } = false;
        public ICollection<TodoItem> TodoItems { get; set; } = [];
    }
}
