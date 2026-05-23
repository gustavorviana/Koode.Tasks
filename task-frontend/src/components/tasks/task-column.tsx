import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Status = "pending" | "in_progress" | "done"

const headerColors: Record<Status, string> = {
  pending: "bg-amber-500",
  in_progress: "bg-sky-500",
  done: "bg-emerald-500",
}

export function TaskColumn({
  status,
  title,
  count,
  children,
}: {
  status: Status
  title: string
  count: number
  children: ReactNode
}) {
  return (
    <div className="flex min-h-0 flex-col rounded-lg bg-muted/40">
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
