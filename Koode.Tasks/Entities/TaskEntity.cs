using Koode.Tasks.Enums;
using Koode.Tasks.Interfaces;

namespace Koode.Tasks.Entities;

public class TaskEntity : ITimestamped
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Enums.TaskStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
