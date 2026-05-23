/* eslint-disable react-hooks/refs */
import { Trash2 } from "lucide-react"
import { useDraggable } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/task"

const dateFmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
})

interface TaskCardProps {
  task: Task
  onDelete: (task: Task) => void
  onEdit?: (task: Task) => void
  isDragging?: boolean
}

export function TaskCard({ task, onDelete, onEdit, isDragging }: TaskCardProps) {
  const isDone = task.status === "done"
  const draggable = useDraggable({
    id: task.id,
    data: { task },
    disabled: isDone,
  })

  function handleClick() {
    if (isDone || draggable.isDragging) return
    onEdit?.(task)
  }

  return (
    <article
      ref={draggable.setNodeRef}
      {...draggable.attributes}
      {...draggable.listeners}
      onClick={handleClick}
      className={cn(
        "group rounded-md border bg-card p-3 shadow-xs transition-shadow",
        "hover:shadow-sm",
        isDone
          ? "cursor-default"
          : "cursor-grab active:cursor-grabbing hover:border-foreground/20",
        (draggable.isDragging || isDragging) && "opacity-50",
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

        <div className="opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-7 text-muted-foreground hover:text-destructive"
            aria-label="Excluir"
            title="Excluir"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              onDelete(task)
            }}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </article>
  )
}
