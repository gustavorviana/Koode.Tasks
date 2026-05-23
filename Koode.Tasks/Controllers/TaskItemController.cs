using Koode.Tasks.Requests;
using Koode.Tasks.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Koode.Tasks.Controllers;

[ApiController]
[Route("[controller]")]
public class TaskItemController(TaskItemService service) : ControllerBase
{
    [HttpGet]
    public async Task<TaskItemResponse[]> GetAllAsync(CancellationToken cancellationToken)
        => await service.GetAllAsync(cancellationToken);

    [HttpPost]
    public async Task<TaskItemResponse> CreateAsync(CreateTaskRequest request, CancellationToken cancellationToken)
        => await service.CreateAsync(request, cancellationToken);
}
