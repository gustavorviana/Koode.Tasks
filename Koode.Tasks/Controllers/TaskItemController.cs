using Koode.Tasks.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Koode.Tasks.Controllers;

[ApiController]
[Route("[controller]")]
public class TaskItemController(TaskItemService service) : ControllerBase
{
    [HttpGet]
    public async Task<TaskItemResponse[]> GetAsync(CancellationToken cancellationToken)
        => await service.GetAllAsync(cancellationToken);
}
