using System.Net;

namespace Koode.Tasks.Exceptions;

public class AppException(HttpStatusCode statusCode, string message, string? title = null, string? type = null)
    : Exception(message)
{
    public HttpStatusCode StatusCode { get; } = statusCode;
    public string? Title { get; } = title;
    public string? Type { get; } = type;
}
