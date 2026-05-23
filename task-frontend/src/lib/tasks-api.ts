import { request } from "@/lib/api"
import type {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "@/types/task"

const BASE = "/api/tasks"

const statusToBackend: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "InProgress",
  done: "Done",
}

export const tasksApi = {
  list(status: TaskStatus | undefined, signal?: AbortSignal): Promise<Task[]> {
    return request<Task[]>(BASE, {
      signal,
      query: { status: status ? statusToBackend[status] : undefined },
    })
  },

  create(input: CreateTaskInput): Promise<Task> {
    return request<Task>(BASE, { method: "POST", body: input })
  },

  update(id: number, input: UpdateTaskInput): Promise<Task> {
    return request<Task>(`${BASE}/${id}`, {
      method: "PUT",
      body: {
        title: input.title,
        description: input.description ?? null,
        status: statusToBackend[input.status],
      },
    })
  },

  remove(id: number): Promise<void> {
    return request<void>(`${BASE}/${id}`, { method: "DELETE" })
  },
}
