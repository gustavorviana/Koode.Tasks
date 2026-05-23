using System.Net;
using Koode.Tasks.Data;
using Koode.Tasks.Entities;
using Koode.Tasks.Enums;
using Koode.Tasks.Exceptions;
using Koode.Tasks.Requests;
using Microsoft.EntityFrameworkCore;

namespace Koode.Tasks.Tests;

public class TaskServiceTests
{
    private readonly AppDbContext _dbContext;

    public TaskServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _dbContext = new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_WhenNoItems_ReturnsEmptyArray()
    {
        var service = new TaskService(_dbContext);

        var result = await service.GetAllAsync(null, CancellationToken.None);

        Assert.Empty(result);
    }

    [Fact]
    public async Task GetAllAsync_WhenItemsExist_ReturnsAllMapped()
    {
        _dbContext.Tasks.AddRange(
            new TaskEntity
            {
                Id = 1,
                Title = "Task A",
                Description = "Desc A",
                Status = Enums.TaskStatus.Pending
            },
            new TaskEntity
            {
                Id = 2,
                Title = "Task B",
                Description = "Desc B",
                Status = Enums.TaskStatus.Done
            });
        await _dbContext.SaveChangesAsync();

        var service = new TaskService(_dbContext);
        var result = await service.GetAllAsync(null, CancellationToken.None);

        Assert.Equal(2, result.Length);

        var first = Assert.Single(result, r => r.Id == 1);
        Assert.Equal("Task A", first.Title);
        Assert.Equal(Enums.TaskStatus.Pending, first.Status);
        Assert.NotEqual(default, first.CreatedAt);
        Assert.Null(first.UpdatedAt);

        var second = Assert.Single(result, r => r.Id == 2);
        Assert.Equal("Task B", second.Title);
        Assert.Equal(Enums.TaskStatus.Done, second.Status);
    }

    [Fact]
    public async Task GetAllAsync_WhenStatusFilterProvided_ReturnsOnlyMatching()
    {
        _dbContext.Tasks.AddRange(
            new TaskEntity { Title = "P1", Status = Enums.TaskStatus.Pending },
            new TaskEntity { Title = "P2", Status = Enums.TaskStatus.Pending },
            new TaskEntity { Title = "D1", Status = Enums.TaskStatus.Done });
        await _dbContext.SaveChangesAsync();

        var service = new TaskService(_dbContext);
        var result = await service.GetAllAsync(Enums.TaskStatus.Pending, CancellationToken.None);

        Assert.Equal(2, result.Length);
        Assert.All(result, r => Assert.Equal(Enums.TaskStatus.Pending, r.Status));
    }

    [Fact]
    public async Task GetAllAsync_WhenStatusFilterMatchesNothing_ReturnsEmptyArray()
    {
        _dbContext.Tasks.Add(new TaskEntity { Title = "P1", Status = Enums.TaskStatus.Pending });
        await _dbContext.SaveChangesAsync();

        var service = new TaskService(_dbContext);
        var result = await service.GetAllAsync(Enums.TaskStatus.Done, CancellationToken.None);

        Assert.Empty(result);
    }

    [Fact]
    public async Task GetAllAsync_WhenStatusFilterNull_ReturnsAll()
    {
        _dbContext.Tasks.AddRange(
            new TaskEntity { Title = "P1", Status = Enums.TaskStatus.Pending },
            new TaskEntity { Title = "D1", Status = Enums.TaskStatus.Done });
        await _dbContext.SaveChangesAsync();

        var service = new TaskService(_dbContext);
        var result = await service.GetAllAsync(null, CancellationToken.None);

        Assert.Equal(2, result.Length);
    }

    [Fact]
    public async Task CreateAsync_PersistsEntityWithPendingStatus()
    {
        var service = new TaskService(_dbContext);
        var request = new CreateTaskRequest
        {
            Title = "New Task",
            Description = "New Desc"
        };

        var before = DateTime.UtcNow;
        var result = await service.CreateAsync(request, CancellationToken.None);
        var after = DateTime.UtcNow;

        Assert.NotEqual(0, result.Id);
        Assert.Equal("New Task", result.Title);
        Assert.Equal("New Desc", result.Description);
        Assert.Equal(Enums.TaskStatus.Pending, result.Status);
        Assert.InRange(result.CreatedAt, before, after);
        Assert.Null(result.UpdatedAt);

        var persisted = await _dbContext.Tasks.SingleAsync();
        Assert.Equal(result.Id, persisted.Id);
        Assert.Equal("New Task", persisted.Title);
        Assert.Equal("New Desc", persisted.Description);
        Assert.Equal(Enums.TaskStatus.Pending, persisted.Status);
    }

    [Fact]
    public async Task CreateAsync_WithNullDescription_PersistsNullDescription()
    {
        var service = new TaskService(_dbContext);
        var request = new CreateTaskRequest { Title = "Only Title", Description = null };

        var result = await service.CreateAsync(request, CancellationToken.None);

        Assert.Null(result.Description);
        var persisted = await _dbContext.Tasks.SingleAsync();
        Assert.Null(persisted.Description);
    }

    [Fact]
    public async Task UpdateAsync_WhenEntityExists_UpdatesFieldsAndSetsUpdatedAt()
    {
        var entity = new TaskEntity
        {
            Title = "Original",
            Description = "Original Desc",
            Status = Enums.TaskStatus.Pending
        };
        _dbContext.Tasks.Add(entity);
        await _dbContext.SaveChangesAsync();

        var originalCreatedAt = entity.CreatedAt;
        var service = new TaskService(_dbContext);
        var request = new UpdateTaskRequest
        {
            Title = "Updated",
            Description = "Updated Desc",
            Status = Enums.TaskStatus.Done
        };

        var before = DateTime.UtcNow;
        var result = await service.UpdateAsync(entity.Id, request, CancellationToken.None);
        var after = DateTime.UtcNow;

        Assert.Equal(entity.Id, result.Id);
        Assert.Equal("Updated", result.Title);
        Assert.Equal("Updated Desc", result.Description);
        Assert.Equal(Enums.TaskStatus.Done, result.Status);
        Assert.Equal(originalCreatedAt, result.CreatedAt);
        Assert.NotNull(result.UpdatedAt);
        Assert.InRange(result.UpdatedAt!.Value, before, after);

        var persisted = await _dbContext.Tasks.SingleAsync();
        Assert.Equal("Updated", persisted.Title);
        Assert.Equal("Updated Desc", persisted.Description);
        Assert.Equal(Enums.TaskStatus.Done, persisted.Status);
    }

    [Fact]
    public async Task UpdateAsync_WhenEntityNotFound_ThrowsNotFoundException()
    {
        var service = new TaskService(_dbContext);
        var request = new UpdateTaskRequest
        {
            Title = "X",
            Description = "Y",
            Status = Enums.TaskStatus.Done
        };

        var ex = await Assert.ThrowsAsync<NotFoundException>(
            () => service.UpdateAsync(999, request, CancellationToken.None));

        Assert.Equal(HttpStatusCode.NotFound, ex.StatusCode);
        Assert.Equal("Task with id 999 not found.", ex.Message);
    }

    [Fact]
    public async Task DeleteAsync_WhenEntityExists_RemovesFromDatabase()
    {
        var entity = new TaskEntity
        {
            Title = "ToDelete",
            Status = Enums.TaskStatus.Pending
        };
        _dbContext.Tasks.Add(entity);
        await _dbContext.SaveChangesAsync();

        var service = new TaskService(_dbContext);
        await service.DeleteAsync(entity.Id, CancellationToken.None);

        Assert.Empty(await _dbContext.Tasks.ToArrayAsync());
    }

    [Fact]
    public async Task DeleteAsync_WhenEntityNotFound_ThrowsNotFoundException()
    {
        var service = new TaskService(_dbContext);

        var ex = await Assert.ThrowsAsync<NotFoundException>(
            () => service.DeleteAsync(999, CancellationToken.None));

        Assert.Equal(HttpStatusCode.NotFound, ex.StatusCode);
        Assert.Equal("Task with id 999 not found.", ex.Message);
    }

    [Fact]
    public async Task UpdateAsync_CanClearDescriptionToNull()
    {
        var entity = new TaskEntity
        {
            Title = "T",
            Description = "Has Desc",
            Status = Enums.TaskStatus.Pending
        };
        _dbContext.Tasks.Add(entity);
        await _dbContext.SaveChangesAsync();

        var service = new TaskService(_dbContext);
        var request = new UpdateTaskRequest
        {
            Title = "T",
            Description = null,
            Status = Enums.TaskStatus.Pending
        };

        var result = await service.UpdateAsync(entity.Id, request, CancellationToken.None);

        Assert.Null(result.Description);
        var persisted = await _dbContext.Tasks.SingleAsync();
        Assert.Null(persisted.Description);
    }
}
