namespace LifeOrganizer.Application.Common.Interfaces
{
    public interface IPushNotificationSender
    {
        Task SendAsync(string pushToken, string title, string body, CancellationToken cancellationToken);
    }
}
