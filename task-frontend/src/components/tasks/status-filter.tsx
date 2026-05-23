import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TaskStatus } from "@/types/task"

export type StatusFilter = TaskStatus | "all"

interface StatusFilterOption {
  value: StatusFilter
  label: string
}

interface StatusFilterSelectProps {
  value: StatusFilter
  onChange: (next: StatusFilter) => void
}

const options: StatusFilterOption[] = [
  { value: "all", label: "Todos os status" },
  { value: "pending", label: "Pendente" },
  { value: "in_progress", label: "Em andamento" },
  { value: "done", label: "Concluída" },
]

export function StatusFilterSelect({ value, onChange }: StatusFilterSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as StatusFilter)}>
      <SelectTrigger className="w-45" aria-label="Filtrar por status">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
