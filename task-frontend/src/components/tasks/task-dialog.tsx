import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Task, TaskStatus } from "@/types/task"

const schema = z.object({
  title: z
    .string()
    .min(1, "Informe um título")
    .max(200, "Máximo de 200 caracteres"),
  description: z.string().max(1000, "Máximo de 1000 caracteres").optional(),
  status: z.enum(["pending", "in_progress", "done"]),
})

export type TaskFormValues = z.infer<typeof schema>

export type TaskDialogMode =
  | { type: "create" }
  | { type: "edit"; task: Task }

export type TaskDialogResult = { ok: true } | { ok: false; error: string }

interface StatusOption {
  value: TaskStatus
  label: string
}

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: TaskDialogMode | null
  onSubmit: (
    values: TaskFormValues,
    mode: TaskDialogMode,
  ) => Promise<TaskDialogResult>
}

const statusOptions: StatusOption[] = [
  { value: "pending", label: "Pendente" },
  { value: "in_progress", label: "Em andamento" },
  { value: "done", label: "Concluída" },
]

const emptyValues: TaskFormValues = {
  title: "",
  description: "",
  status: "pending",
}

export function TaskDialog({ open, onOpenChange, mode, onSubmit }: TaskDialogProps) {
  const isEdit = mode?.type === "edit"
  const [keepOpen, setKeepOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (!open || !mode) return
    if (mode.type === "edit") {
      form.reset({
        title: mode.task.title,
        description: mode.task.description ?? "",
        status: mode.task.status,
      })
    } else {
      form.reset(emptyValues)
    }
  }, [open, mode, form])

  const submitting = form.formState.isSubmitting

  function handleOpenChange(next: boolean) {
    if (submitting) return
    if (!next) setSubmitError(null)
    onOpenChange(next)
  }

  async function handleSubmit(values: TaskFormValues) {
    if (!mode) return
    setSubmitError(null)
    const result = await onSubmit(values, mode)
    if (!result.ok) {
      setSubmitError(result.error)
      return
    }
    if (mode.type === "create" && keepOpen) {
      form.reset(emptyValues)
      form.setFocus("title")
    } else {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar tarefa" : "Nova tarefa"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Atualize as informações da tarefa."
              : "Preencha os dados para criar uma nova tarefa."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {submitError && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}
            <fieldset disabled={submitting} className="contents">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex.: Revisar PR de pagamentos"
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Opcional"
                        {...field}
                        value={field.value ?? ""}
                        className="sm:min-h-48"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEdit && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={submitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </fieldset>

            <DialogFooter className="sm:justify-between">
              {!isEdit ? (
                <label className="flex items-center gap-2 text-sm text-muted-foreground select-none">
                  <Checkbox
                    checked={keepOpen}
                    onCheckedChange={(v) => setKeepOpen(v === true)}
                    disabled={submitting}
                  />
                  Criar outra em seguida
                </label>
              ) : (
                <span />
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="size-4 animate-spin" />}
                  {isEdit ? "Salvar" : "Criar"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
