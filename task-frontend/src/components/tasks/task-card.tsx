import { Check, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/task"

const dateFmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
})

export function TaskCard({ task }: { task: Task }) {
  const isDone = task.status === "done"

  return (
    <article
      className={cn(
        "group rounded-md border bg-card p-3 shadow-xs transition-shadow",
        "hover:shadow-sm",
      )}
    >
      <h3
        className={cn(
          "text-sm font-medium leading-snug",
          isDone && "line-through text-muted-foreground",
        )}
      >
        {task.title}
      </h3>

      {task.description && (
        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-3">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <time className="text-[11px] text-muted-foreground tabular-nums">
          {dateFmt.format(new Date(task.createdAt))}
        </time>

        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          {!isDone && (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="size-7"
                aria-label="Concluir"
                title="Concluir"
              >
                <Check className="size-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-7"
                aria-label="Editar"
                title="Editar"
              >
                <Pencil className="size-3.5" />
              </Button>
            </>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="size-7 text-muted-foreground hover:text-destructive"
            aria-label="Excluir"
            title="Excluir"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </article>
  )
}
