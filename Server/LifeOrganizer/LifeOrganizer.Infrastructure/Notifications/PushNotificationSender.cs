using LifeOrganizer.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;

namespace LifeOrganizer.Infrastructure.Notifications
{
    public class PushNotificationSender : IPushNotificationSender
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<PushNotificationSender> _logger;
        public PushNotificationSender(HttpClient httpClient, ILogger<PushNotificationSender> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
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
            var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);

            _logger.LogInformation("Expo push response: {ResponseBody}", responseBody);

            response.EnsureSuccessStatusCode();

            if (responseBody.Contains("\"status\":\"error\"", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException($"Expo push notification failed: {responseBody}");
            }
        }
    }
}
