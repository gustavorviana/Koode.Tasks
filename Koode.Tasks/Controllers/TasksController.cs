using Koode.Tasks.Requests;
using Koode.Tasks.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Koode.Tasks.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController(TaskService service) : ControllerBase
{
    [HttpGet]
    public async Task<TaskResponse[]> GetAllAsync([FromQuery] Enums.TaskStatus? status, CancellationToken cancellationToken)
        => await service.GetAllAsync(status, cancellationToken);

    [HttpGet("{id:int}")]
    public async Task<TaskResponse> GetByIdAsync(int id, CancellationToken cancellationToken)
        => await service.GetByIdAsync(id, cancellationToken);

    [HttpPost]
    public async Task<ActionResult<TaskResponse>> CreateAsync(CreateTaskRequest request, CancellationToken cancellationToken)
    {
        var created = await service.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<TaskResponse> UpdateAsync(int id, UpdateTaskRequest request, CancellationToken cancellationToken)
        => await service.UpdateAsync(id, request, cancellationToken);

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        await service.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
