using Koode.Tasks.DependencyInjection;
using Koode.Tasks.Exceptions;

var builder = WebApplication.CreateBuilder(args);

builder
    .Services
    .AddDatabase(builder.Configuration.GetConnectionString("Default"))
    .AddAppServices()
    .AddExceptionHandler<AppExceptionHandler>()
    .AddProblemDetails()
    .AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseExceptionHandler();

app.UseHttpsRedirection();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();
