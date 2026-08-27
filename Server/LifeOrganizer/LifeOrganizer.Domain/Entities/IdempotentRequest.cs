namespace LifeOrganizer.Domain.Entities
{
    public class IdempotentRequest
    {
        public Guid Id { get; set; }
        public string IdempotencyKey { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public string RequestPath { get; set; } = string.Empty;
        public int ResponseStatusCode { get; set; }
        public string ResponseBody { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
