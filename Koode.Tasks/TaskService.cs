using Koode.Tasks.Data;
using Koode.Tasks.Entities;
using Koode.Tasks.Requests;
using Koode.Tasks.Responses;
using Microsoft.EntityFrameworkCore;

namespace Koode.Tasks;

public class TaskService(AppDbContext context)
{
    public async Task<TaskResponse[]> GetAllAsync(CancellationToken cancellationToken)
    {
        var items = await context.Tasks.ToArrayAsync(cancellationToken);
        return [.. items.Select(MapToResponse)];
    }

    public async Task<TaskResponse> CreateAsync(CreateTaskRequest request, CancellationToken cancellationToken)
    {
        var entity = new TaskEntity
        {
            Title = request.Title,
            Description = request.Description,
            Status = Enums.TaskStatus.Pending
        };

        context.Tasks.Add(entity);
        await context.SaveChangesAsync(cancellationToken);

        return MapToResponse(entity);
    }

    public async Task<TaskResponse> UpdateAsync(int id, UpdateTaskRequest request, CancellationToken cancellationToken)
    {
        var entity = await context.Tasks.FirstOrDefaultAsync(x => x.Id == id, cancellationToken) ??
            throw new InvalidOperationException("Task not found.");

        entity.Title = request.Title;
        entity.Description = request.Description;
        entity.Status = request.Status;

        await context.SaveChangesAsync(cancellationToken);

        return MapToResponse(entity);
    }

    private TaskResponse MapToResponse(TaskEntity item)
        => new()
        {
            Id = item.Id,
            Title = item.Title,
            Description = item.Description,
            Status = item.Status,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt
        };
}
