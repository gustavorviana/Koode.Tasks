export class ApiError extends Error {
  status: number
  detail?: string

  constructor(status: number, message: string, detail?: string) {
    super(message)
    this.status = status
    this.detail = detail
  }
}

type RequestOptions = {
  method?: string
  body?: unknown
  signal?: AbortSignal
  query?: Record<string, string | number | boolean | null | undefined>
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, options.query)
  const init: RequestInit = {
    method: options.method ?? "GET",
    signal: options.signal,
    headers: options.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  }

  const res = await fetch(url, init)

  if (!res.ok) {
    let detail: string | undefined
    try {
      const problem = (await res.json()) as { title?: string; detail?: string }
      detail = problem.detail ?? problem.title
    } catch {
      // body wasn't JSON
    }
    throw new ApiError(res.status, `HTTP ${res.status}`, detail)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  if (!query) return path
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue
    params.append(key, String(value))
  }
  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}
