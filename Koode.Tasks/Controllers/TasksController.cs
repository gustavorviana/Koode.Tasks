using Koode.Tasks.Requests;
using Koode.Tasks.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Koode.Tasks.Controllers;

[ApiController]
[Route("[controller]")]
public class TasksController(TaskService service) : ControllerBase
{
    [HttpGet]
    public async Task<TaskResponse[]> GetAllAsync(CancellationToken cancellationToken)
        => await service.GetAllAsync(cancellationToken);

    [HttpPost]
    public async Task<TaskResponse> CreateAsync(CreateTaskRequest request, CancellationToken cancellationToken)
        => await service.CreateAsync(request, cancellationToken);

    [HttpPut("{id:int}")]
        public async Task<TaskResponse> UpdateAsync(int id, UpdateTaskRequest request, CancellationToken cancellationToken)
        => await service.UpdateAsync(id, request, cancellationToken);
}
