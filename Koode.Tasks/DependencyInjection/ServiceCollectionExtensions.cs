namespace Koode.Tasks.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAppServices(this IServiceCollection services)
    {
        services.AddTransient<TaskService>();
        return services;
    }
}
