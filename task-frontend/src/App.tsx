import { useState } from "react"
import { Plus, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/tasks/task-card"
import { TaskColumn } from "@/components/tasks/task-column"
import {
  StatusFilterSelect,
  type StatusFilter,
} from "@/components/tasks/status-filter"
import { useTasks } from "@/hooks/use-tasks"
import type { TaskStatus } from "@/types/task"

const columns: { status: TaskStatus; title: string }[] = [
  { status: "pending", title: "Pendente" },
  { status: "in_progress", title: "Em andamento" },
  { status: "done", title: "Concluída" },
]

function App() {
  const [filter, setFilter] = useState<StatusFilter>("all")
  const backendFilter = filter === "all" ? undefined : filter

  const { tasks, loading, error, refetch } = useTasks(backendFilter)

  const visibleColumns =
    filter === "all" ? columns : columns.filter((c) => c.status === filter)

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Tarefas</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {loading
                ? "Carregando…"
                : `${tasks.length} ${tasks.length === 1 ? "tarefa" : "tarefas"} no quadro`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusFilterSelect value={filter} onChange={setFilter} />
            <Button>
              <Plus className="size-4" />
              Nova tarefa
            </Button>
          </div>
        </header>

        {error ? (
          <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => refetch()}
            >
              <RotateCw className="size-3.5" />
              Tentar novamente
            </Button>
          </div>
        ) : (
          <section
            className={
              filter === "all"
                ? "mt-8 grid gap-4 md:grid-cols-3"
                : "mt-8 grid gap-4"
            }
          >
            {visibleColumns.map((col) => {
              const items = tasks.filter((t) => t.status === col.status)
              return (
                <TaskColumn
                  key={col.status}
                  status={col.status}
                  title={col.title}
                  count={items.length}
                >
                  {loading ? (
                    <ColumnSkeleton />
                  ) : items.length === 0 ? (
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
        )}
      </div>
    </div>
  )
}

function ColumnSkeleton() {
  return (
    <div className="space-y-2">
      {[0, 1].map((i) => (
        <div key={i} className="rounded-md border bg-card p-3">
          <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-2.5 w-full animate-pulse rounded bg-muted" />
          <div className="mt-1.5 h-2.5 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

export default App
