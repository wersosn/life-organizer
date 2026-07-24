using LifeOrganizer.Application.Common.Interfaces;

namespace LifeOrganizer.Tests.Helpers
{
    public class FakeCurrentUserService : ICurrentUserService
    {
        public Guid UserId { get; set; }
        public FakeCurrentUserService(Guid userId)
        {
            UserId = userId;
        }
    }
}
