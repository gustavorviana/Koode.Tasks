using System.Net;

namespace Koode.Tasks.Exceptions;

public class NotFoundException(string message)
    : AppException(HttpStatusCode.NotFound, message, title: "Recurso não encontrado");
