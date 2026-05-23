export type TaskStatus = "pending" | "in_progress" | "done"

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  createdAt: string
  updatedAt: string | null
}

export interface CreateTaskInput {
  title: string
  description?: string | null
}

export interface UpdateTaskInput {
  title: string
  description?: string | null
  status: TaskStatus
}
