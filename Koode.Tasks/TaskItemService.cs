using Koode.Tasks.Data;
using Koode.Tasks.Entities;
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

    private TaskItemResponse MapToResponse(TaskItemEntity item)
        => new()
        {
            Id = item.Id,
            Title = item.Title,
            Description = item.Title,
            Status = item.Status,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt
        };
}
