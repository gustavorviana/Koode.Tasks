import { useState } from "react"
import { ApiError } from "@/lib/api"
import { tasksApi } from "@/lib/tasks-api"
import type {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "@/types/task"

export type MutationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

function messageFromError(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.detail ?? `Erro ${err.status}: ${fallback}`
  return fallback
}

export function useTaskMutations() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function runQuiet<T>(
    action: () => Promise<T>,
    fallback: string,
  ): Promise<MutationResult<T>> {
    setPending(true)
    try {
      const data = await action()
      return { ok: true, data }
    } catch (err) {
      return { ok: false, error: messageFromError(err, fallback) }
    } finally {
      setPending(false)
    }
  }

  async function runWithBanner<T>(
    action: () => Promise<T>,
    fallback: string,
  ): Promise<T | null> {
    setPending(true)
    setError(null)
    try {
      return await action()
    } catch (err) {
      setError(messageFromError(err, fallback))
      return null
    } finally {
      setPending(false)
    }
  }

  return {
    pending,
    error,
    clearError: () => setError(null),

    create(input: CreateTaskInput) {
      return runQuiet<Task>(
        () => tasksApi.create(input),
        "Não foi possível criar a tarefa",
      )
    },

    update(id: number, input: UpdateTaskInput) {
      return runQuiet<Task>(
        () => tasksApi.update(id, input),
        "Não foi possível salvar a tarefa",
      )
    },

    changeStatus(task: Task, status: TaskStatus) {
      return runWithBanner<Task>(
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
      return runWithBanner(
        () => tasksApi.remove(id),
        "Não foi possível excluir a tarefa",
      )
    },
  }
}
