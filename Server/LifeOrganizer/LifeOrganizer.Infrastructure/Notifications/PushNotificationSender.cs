using LifeOrganizer.Application.Common.Interfaces;
using System.Net.Http.Json;

namespace LifeOrganizer.Infrastructure.Notifications
{
    public class PushNotificationSender : IPushNotificationSender
    {
        private readonly HttpClient _httpClient;
        public PushNotificationSender(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task SendAsync(string pushToken, string title, string body, CancellationToken cancellationToken)
        {
            var payload = new
            {
                to = pushToken,
                title,
                body,
                sound = "default",
            };
            var response = await _httpClient.PostAsJsonAsync("https://exp.host/--/api/v2/push/send", payload, cancellationToken);
            response.EnsureSuccessStatusCode();
        }
    }
}
