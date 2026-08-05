using MediatR;


namespace LifeOrganizer.Application.Users.Commands.CurrentUser
{
    public record GetCurrentUserQuery(Guid UserId) : IRequest<CurrentUserDto>;
}
