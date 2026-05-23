using System.Net;

namespace Koode.Tasks.Exceptions;

public class BadRequestException(string message)
    : AppException(HttpStatusCode.BadRequest, message, title: "Bad request");
