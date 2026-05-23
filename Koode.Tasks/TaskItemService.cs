using Koode.Tasks.Data;
using Koode.Tasks.Entities;
using Koode.Tasks.Enums;
using Koode.Tasks.Requests;
using Koode.Tasks.Responses;
using Microsoft.EntityFrameworkCore;

namespace Koode.Tasks;

public class TaskItemService(AppDbContext context)
{
    public async Task<TaskItemResponse[]> GetAllAsync(CancellationToken cancellationToken)
    {
        var items = await context.TaskItems.ToArrayAsync(cancellationToken);
        return [..items.Select(MapToResponse)];
    }

    public async Task<TaskItemResponse> CreateAsync(CreateTaskRequest request, CancellationToken cancellationToken)
    {
        var entity = new TaskItemEntity
        {
            Title = request.Title,
            Description = request.Description,
            Status = TaskItemStatus.Pending
        };

        context.TaskItems.Add(entity);
        await context.SaveChangesAsync(cancellationToken);

        return MapToResponse(entity);
    }

    private TaskItemResponse MapToResponse(TaskItemEntity item)
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
