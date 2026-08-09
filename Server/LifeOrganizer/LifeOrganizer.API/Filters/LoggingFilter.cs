using Microsoft.AspNetCore.Mvc.Filters;

namespace LifeOrganizer.API.Filters
{
    public class LoggingFilter : ActionFilterAttribute
    {
        private readonly ILogger<LoggingFilter> _logger;

        public LoggingFilter(ILogger<LoggingFilter> logger)
        {
            _logger = logger;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            _logger.LogInformation("Start: {path}", context.HttpContext.Request.Path);
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            _logger.LogInformation("End: {status}", context.HttpContext.Response.StatusCode);
        }
    }
}
