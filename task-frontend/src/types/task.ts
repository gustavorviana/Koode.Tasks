export type TaskStatus = "pending" | "in_progress" | "done"

export type Task = {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  createdAt: string
  updatedAt: string | null
}

export type CreateTaskInput = {
  title: string
  description?: string | null
}

export type UpdateTaskInput = {
  title: string
  description?: string | null
  status: TaskStatus
}
