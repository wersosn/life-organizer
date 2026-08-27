using LifeOrganizer.Application.Common.Interfaces;
using LifeOrganizer.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LifeOrganizer.API.Middlewares
{
    public class IdempotencyMiddleware
    {
        private readonly RequestDelegate _next;
        private const string HeaderName = "Idempotency-Key";

        public IdempotencyMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IApplicationDbContext dbContext, ICurrentUserService currentUser)
        {
            if (context.Request.Method != HttpMethods.Post || !context.Request.Headers.TryGetValue(HeaderName, out var keyValues))
            {
                await _next(context);
                return;
            }

            var idempotencyKey = keyValues.ToString();
            if (string.IsNullOrWhiteSpace(idempotencyKey))
            {
                await _next(context);
                return;
            }

            Guid userId;
            try
            {
                userId = currentUser.UserId;
            }
            catch
            {
                await _next(context);
                return;
            }

            var existing = await dbContext.IdempotentRequests.FirstOrDefaultAsync(r => r.UserId == userId && r.IdempotencyKey == idempotencyKey);
            if (existing is not null)
            {
                context.Response.StatusCode = existing.ResponseStatusCode;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(existing.ResponseBody);
                return;
            }

            var originalBodyStream = context.Response.Body;
            using var responseBuffer = new MemoryStream();
            context.Response.Body = responseBuffer;

            await _next(context);

            responseBuffer.Seek(0, SeekOrigin.Begin);
            var responseBody = await new StreamReader(responseBuffer).ReadToEndAsync();

            if (context.Response.StatusCode is >= 200 and < 300)
            {
                dbContext.IdempotentRequests.Add(new IdempotentRequest
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    IdempotencyKey = idempotencyKey,
                    RequestPath = context.Request.Path,
                    ResponseStatusCode = context.Response.StatusCode,
                    ResponseBody = responseBody,
                });
                await dbContext.SaveChangesAsync(context.RequestAborted);
            }

            responseBuffer.Seek(0, SeekOrigin.Begin);
            await responseBuffer.CopyToAsync(originalBodyStream);
            context.Response.Body = originalBodyStream;
        }
    }
}
