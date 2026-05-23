# Koode.Tasks

Aplicação fullstack de gerenciamento de tarefas (Kanban) — teste técnico Koode.

## Stack

**Backend**
- .NET 10 / ASP.NET Core Web API
- Entity Framework Core 10
- SQLite
- xUnit (testes)

**Frontend**
- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4 + shadcn/ui (radix-nova)
- @dnd-kit (drag-and-drop)
- React Hook Form + Zod (validação)

## Pré-requisitos

- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [dotnet-ef](https://learn.microsoft.com/ef/core/cli/dotnet) para aplicar as migrations:

  ```bash
  dotnet tool install --global dotnet-ef
  ```

## Setup do banco

Antes do primeiro start, aplicar as migrations:

```bash
dotnet ef database update --project Koode.Tasks
```

O arquivo `koode-tasks.db` será criado em `Koode.Tasks/` (configurado em `appsettings.Development.json`).

## Como rodar

### Modo desenvolvimento (HMR no frontend)

Dois processos em terminais separados:

**Terminal 1 — backend**

```bash
dotnet run --project Koode.Tasks --launch-profile https
```

Backend sobe em `https://localhost:7175` (e `http://localhost:5008`).

**Terminal 2 — frontend**

```bash
cd task-frontend
pnpm install
pnpm dev
```

Frontend disponível em [http://localhost:5173](http://localhost:5173). Vite proxia `/api/*` para o backend, evitando CORS.

### Modo produção (SPA servida pelo backend)

```bash
cd task-frontend && pnpm install && cd ..
dotnet run --project Koode.Tasks --launch-profile https
```

O build do .NET dispara o `pnpm run build` automaticamente (target `BuildSpa` no `.csproj`) e copia o resultado para `Koode.Tasks/wwwroot/`. Acesse [https://localhost:7175](https://localhost:7175).

## API

Base URL: `/api/tasks`

| Método | Rota                | Descrição                          | Status sucesso |
| ------ | ------------------- | ---------------------------------- | -------------- |
| GET    | `/api/tasks`        | Lista tarefas (filtro `?status=`)  | 200            |
| GET    | `/api/tasks/{id}`   | Busca tarefa por id                | 200            |
| POST   | `/api/tasks`        | Cria tarefa                        | 201 + Location |
| PUT    | `/api/tasks/{id}`   | Atualiza tarefa                    | 200            |
| DELETE | `/api/tasks/{id}`   | Exclui tarefa                      | 204            |

**Status possíveis:** `pending`, `in_progress`, `done`.

**Modelo de tarefa:**

```json
{
  "id": 1,
  "title": "Revisar PR",
  "description": "Conferir testes",
  "status": "pending",
  "createdAt": "2026-05-23T12:00:00Z",
  "updatedAt": null
}
```

**Erros:** padrão [RFC 7807 ProblemDetails](https://datatracker.ietf.org/doc/html/rfc7807).

```json
{
  "status": 404,
  "title": "Recurso não encontrado",
  "detail": "Tarefa com id 999 não encontrada.",
  "instance": "/api/tasks/999"
}
```

**Regras:**

- Tarefa em `done` não pode ser editada — backend retorna **400 Bad Request**.
- Tarefa em `done` não pode ser arrastada para outra coluna (bloqueio no frontend + backend).

## Estrutura

```
Koode.Tasks/                       Projeto backend
├── Controllers/                   Endpoints HTTP
├── Data/
│   ├── AppDbContext.cs            DbContext + audit interceptor
│   ├── Configuration/             Fluent API
│   └── Migrations/                Migrations EF Core
├── DependencyInjection/           Extension methods de DI
├── Entities/                      Entidades de domínio
├── Enums/                         TaskStatus
├── Exceptions/                    AppException, NotFoundException, BadRequestException + handler RFC 7807
├── Requests/                      DTOs de entrada (Create/UpdateTaskRequest)
├── Responses/                     DTOs de saída (TaskResponse)
├── TaskService.cs                 Lógica de aplicação
└── Program.cs                     Composição da aplicação

Koode.Tasks.Tests/                 Testes unitários (xUnit + InMemory DB)

task-frontend/                     Projeto React
├── src/
│   ├── components/
│   │   ├── ui/                    Primitivos shadcn
│   │   └── tasks/                 Componentes de domínio (TaskCard, TaskColumn, TaskDialog, StatusFilterSelect)
│   ├── hooks/                     useTasks (lista) + useTaskMutations
│   ├── lib/                       Cliente HTTP + tasksApi tipado
│   ├── types/                     Task, TaskStatus, CreateTaskInput, UpdateTaskInput
│   ├── App.tsx                    Página principal (Kanban)
│   └── main.tsx
├── index.html
├── vite.config.ts                 Proxy /api → backend
└── package.json
```

## Decisões de arquitetura

- **Status no JSON em snake_case (`pending`/`in_progress`/`done`)**: configurado em `Program.cs` via `JsonStringEnumConverter` + `JsonNamingPolicy.SnakeCaseLower`. Coerente com a spec.
- **Datas geradas no backend**: `AppDbContext` aplica `CreatedAt` (em `Added`) e `UpdatedAt` (em `Modified`) via interceptor (`ApplyAuditFields`).
- **Erros padronizados (RFC 7807)**: `AppExceptionHandler` (`IExceptionHandler`) mapeia `AppException` (e subclasses) para `ProblemDetails`.
- **Optimistic UI**: drag-and-drop e delete atualizam a UI antes da resposta do servidor; em caso de falha, faz rollback.
- **Filtro server-side**: `GET /api/tasks?status=<valor>` aplica `Where` no EF Core, não filtra no cliente.
- **SPA + API mesma origem em produção**: build do frontend é integrado ao `dotnet build` via target MSBuild, evitando CORS.

## Testes

```bash
dotnet test
```

13 testes cobrindo: listagem (vazia/cheia/filtrada), criação, atualização (sucesso, NotFound, bloqueio em Done), exclusão (sucesso, NotFound, não afeta outras).

## Migrations (manual)

Criar nova:

```bash
dotnet ef migrations add <Nome> --project Koode.Tasks --output-dir Data/Migrations
```

Remover última (se não aplicada):

```bash
dotnet ef migrations remove --project Koode.Tasks
```

Gerar script SQL:

```bash
dotnet ef migrations script --project Koode.Tasks
```
