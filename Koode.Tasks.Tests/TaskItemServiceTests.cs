using Koode.Tasks.Data;
using Koode.Tasks.Entities;
using Koode.Tasks.Enums;
using Microsoft.EntityFrameworkCore;

namespace Koode.Tasks.Tests;

public class TaskItemServiceTests
{
    private readonly AppDbContext _dbContext;

    public TaskItemServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _dbContext = new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_WhenNoItems_ReturnsEmptyArray()
    {
        var service = new TaskItemService(_dbContext);

        var result = await service.GetAllAsync(CancellationToken.None);

        Assert.Empty(result);
    }

    [Fact]
    public async Task GetAllAsync_WhenItemsExist_ReturnsAllMapped()
    {
        var created = new DateTime(2026, 1, 1, 10, 0, 0, DateTimeKind.Utc);
        var updated = new DateTime(2026, 1, 2, 11, 0, 0, DateTimeKind.Utc);

        _dbContext.TaskItems.AddRange(
            new TaskItemEntity
            {
                Id = 1,
                Title = "Task A",
                Description = "Desc A",
                Status = TaskItemStatus.Pending,
                CreatedAt = created,
                UpdatedAt = updated
            },
            new TaskItemEntity
            {
                Id = 2,
                Title = "Task B",
                Description = "Desc B",
                Status = TaskItemStatus.Done,
                CreatedAt = created,
                UpdatedAt = updated
            });
        await _dbContext.SaveChangesAsync();

        var service = new TaskItemService(_dbContext);
        var result = await service.GetAllAsync(CancellationToken.None);

        Assert.Equal(2, result.Length);

        var first = Assert.Single(result, r => r.Id == 1);
        Assert.Equal("Task A", first.Title);
        Assert.Equal(TaskItemStatus.Pending, first.Status);
        Assert.Equal(created, first.CreatedAt);
        Assert.Equal(updated, first.UpdatedAt);

        var second = Assert.Single(result, r => r.Id == 2);
        Assert.Equal("Task B", second.Title);
        Assert.Equal(TaskItemStatus.Done, second.Status);
    }
}
