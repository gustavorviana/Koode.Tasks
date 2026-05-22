# Koode.Tasks

API de gerenciamento de tarefas.

## Tecnologias

- .NET 10 (ASP.NET Core Web API)
- Entity Framework Core 10
- SQLite

## Estrutura

- `Koode.Tasks/Entities` — entidades de domínio
- `Koode.Tasks/Data` — `AppDbContext` e configurações de entidades
- `Koode.Tasks/Data/Migrations` — migrations do EF Core
- `Koode.Tasks/Controllers` — endpoints HTTP

## Como rodar

```bash
dotnet run --project Koode.Tasks
```

## Migrations

Pré-requisito: instalar a CLI do EF Core (uma vez por máquina).

```bash
dotnet tool install --global dotnet-ef
```

Atualizar para a versão mais recente:

```bash
dotnet tool update --global dotnet-ef
```

### Criar uma nova migration

A partir da raiz do repositório:

```bash
dotnet ef migrations add <NomeDaMigration> --project Koode.Tasks --output-dir Data/Migrations
```

Exemplo:

```bash
dotnet ef migrations add AddTaskItem --project Koode.Tasks --output-dir Data/Migrations
```

### Aplicar migrations ao banco

```bash
dotnet ef database update --project Koode.Tasks
```

### Remover a última migration (caso ainda não tenha sido aplicada)

```bash
dotnet ef migrations remove --project Koode.Tasks
```

### Gerar script SQL

```bash
dotnet ef migrations script --project Koode.Tasks
```
