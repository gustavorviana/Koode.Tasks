import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
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

type Mode =
  | { type: "create" }
  | { type: "edit"; task: Task }

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "pending", label: "Pendente" },
  { value: "in_progress", label: "Em andamento" },
  { value: "done", label: "Concluída" },
]

export function TaskDialog({
  open,
  onOpenChange,
  mode,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: Mode | null
  onSubmit: (values: TaskFormValues, mode: Mode) => void | Promise<void>
}) {
  const isEdit = mode?.type === "edit"

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
    },
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
      form.reset({ title: "", description: "", status: "pending" })
    }
  }, [open, mode, form])

  async function handleSubmit(values: TaskFormValues) {
    if (!mode) return
    await onSubmit(values, mode)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEdit ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
