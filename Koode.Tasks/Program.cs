using Koode.Tasks.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDatabase(builder.Configuration.GetConnectionString("Default"));

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
