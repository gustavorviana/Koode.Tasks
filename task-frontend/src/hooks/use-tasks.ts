import { useCallback, useEffect, useState } from "react"
import { ApiError } from "@/lib/api"
import { tasksApi } from "@/lib/tasks-api"
import type { Task, TaskStatus } from "@/types/task"

type State = {
  tasks: Task[]
  loading: boolean
  error: string | null
}

function messageFromError(err: unknown): string {
  if (err instanceof ApiError) {
    return err.detail ?? `Erro ${err.status} ao carregar tarefas`
  }
  return "Não foi possível carregar as tarefas"
}

export function useTasks(filter: TaskStatus | undefined) {
  const [state, setState] = useState<State>({
    tasks: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    void (async () => {
      try {
        const tasks = await tasksApi.list(filter, controller.signal)
        if (!active) return
        setState({ tasks, loading: false, error: null })
      } catch (err) {
        if (!active || controller.signal.aborted) return
        setState({ tasks: [], loading: false, error: messageFromError(err) })
      }
    })()

    return () => {
      active = false
      controller.abort()
    }
  }, [filter])

  const refetch = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const tasks = await tasksApi.list(filter)
      setState({ tasks, loading: false, error: null })
    } catch (err) {
      setState({ tasks: [], loading: false, error: messageFromError(err) })
    }
  }, [filter])

  return { ...state, refetch }
}
