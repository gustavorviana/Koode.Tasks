using Koode.Tasks.Enums;

namespace Koode.Tasks.Responses;

public class TaskItemResponse
{
    public int Id { get; init; }
    public required string Title { get; init; }
    public string? Description { get; init; }
    public TaskItemStatus Status { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}