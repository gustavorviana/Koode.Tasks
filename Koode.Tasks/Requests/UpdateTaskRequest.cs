using System.ComponentModel.DataAnnotations;

namespace Koode.Tasks.Requests;

public class UpdateTaskRequest
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public string Title { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Description { get; set; }

    [Required]
    [EnumDataType(typeof(Enums.TaskStatus))]
    public Enums.TaskStatus Status { get; set; }
}