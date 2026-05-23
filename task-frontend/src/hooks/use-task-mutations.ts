import { useState } from "react"
import { ApiError } from "@/lib/api"
import { tasksApi } from "@/lib/tasks-api"
import type { Task, TaskStatus } from "@/types/task"

function messageFromError(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.detail ?? `Erro ${err.status}: ${fallback}`
  return fallback
}

export function useTaskMutations() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run<T>(action: () => Promise<T>, errMsg: string): Promise<T | null> {
    setPending(true)
    setError(null)
    try {
      const result = await action()
      return result
    } catch (err) {
      setError(messageFromError(err, errMsg))
      return null
    } finally {
      setPending(false)
    }
  }

  return {
    pending,
    error,
    clearError: () => setError(null),

    changeStatus(task: Task, status: TaskStatus) {
      return run<Task>(
        () =>
          tasksApi.update(task.id, {
            title: task.title,
            description: task.description,
            status,
          }),
        "Não foi possível alterar o status",
      )
    },

    remove(id: number) {
      return run(() => tasksApi.remove(id), "Não foi possível excluir a tarefa")
    },
  }
}
