using Koode.Tasks.Enums;

namespace Koode.Tasks.Responses;

public class TaskResponse
{
    public int Id { get; init; }
    public required string Title { get; init; }
    public string? Description { get; init; }
    public Enums.TaskStatus Status { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}