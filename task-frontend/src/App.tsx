import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskCard, type Task } from "@/components/tasks/task-card"
import { TaskColumn } from "@/components/tasks/task-column"
import { StatusFilterSelect } from "@/components/tasks/status-filter"

const mock: Task[] = [
  {
    id: 1,
    title: "Revisar PR #142 do módulo de pagamentos",
    description:
      "Conferir tratamento de erro do gateway e os testes de integração antes de aprovar.",
    status: "in_progress",
    createdAt: "2026-05-18T14:30:00Z",
    updatedAt: null,
  },
  {
    id: 2,
    title: "Atualizar dependências do projeto",
    description:
      "Subir EF Core, xUnit e pacotes do frontend para as versões mais recentes.",
    status: "pending",
    createdAt: "2026-05-20T09:10:00Z",
    updatedAt: null,
  },
  {
    id: 3,
    title: "Documentar fluxo de onboarding",
    description: null,
    status: "pending",
    createdAt: "2026-05-21T16:00:00Z",
    updatedAt: null,
  },
  {
    id: 4,
    title: "Quebrar o monolito de notificações",
    description:
      "Separar push, e-mail e SMS em workers independentes com filas dedicadas.",
    status: "in_progress",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: null,
  },
  {
    id: 5,
    title: "Migrar feature flags para o novo provider",
    description:
      "Substituir a integração antiga, manter compatibilidade temporária por uma semana.",
    status: "done",
    createdAt: "2026-05-12T11:20:00Z",
    updatedAt: "2026-05-19T08:45:00Z",
  },
  {
    id: 6,
    title: "Corrigir timezone nos relatórios mensais",
    description: null,
    status: "done",
    createdAt: "2026-05-10T08:00:00Z",
    updatedAt: "2026-05-13T17:30:00Z",
  },
]

const columns = [
  { status: "pending" as const, title: "Pendente" },
  { status: "in_progress" as const, title: "Em andamento" },
  { status: "done" as const, title: "Concluída" },
]

function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Tarefas</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mock.length} tarefas no quadro
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusFilterSelect />
            <Button>
              <Plus className="size-4" />
              Nova tarefa
            </Button>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {columns.map((col) => {
            const items = mock.filter((t) => t.status === col.status)
            return (
              <TaskColumn
                key={col.status}
                status={col.status}
                title={col.title}
                count={items.length}
              >
                {items.length === 0 ? (
                  <div className="rounded-md border border-dashed py-6 text-center">
                    <p className="text-xs text-muted-foreground">Vazio</p>
                  </div>
                ) : (
                  items.map((task) => <TaskCard key={task.id} task={task} />)
                )}
              </TaskColumn>
            )
          })}
        </section>
      </div>
    </div>
  )
}

export default App
