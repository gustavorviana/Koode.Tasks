/* eslint-disable react-hooks/refs */
import type { ReactNode } from "react"
import { useDroppable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import type { TaskStatus } from "@/types/task"

const headerColors: Record<TaskStatus, string> = {
  pending: "bg-amber-500",
  in_progress: "bg-sky-500",
  done: "bg-emerald-500",
}

interface TaskColumnProps {
  status: TaskStatus
  title: string
  count: number
  children: ReactNode
}

export function TaskColumn({ status, title, count, children }: TaskColumnProps) {
  const droppable = useDroppable({ id: `column-${status}`, data: { status } })

  return (
    <div
      ref={droppable.setNodeRef}
      className={cn(
        "flex min-h-0 flex-col rounded-lg bg-muted/40 transition-colors",
        droppable.isOver && "bg-muted ring-2 ring-foreground/20",
      )}
    >
      <header className="flex items-center gap-2 px-3 py-2.5">
        <span className={cn("size-2 rounded-full", headerColors[status])} />
        <h2 className="text-sm font-medium">{title}</h2>
        <span className="ml-auto rounded-full bg-background px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
          {count}
        </span>
      </header>
      <div className="flex-1 space-y-2 px-2 pb-2">{children}</div>
    </div>
  )
}
