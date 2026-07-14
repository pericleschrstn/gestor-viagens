"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ALL_CATEGORIES, CATEGORY_CONFIG } from "@/lib/categories"
import { todayIsoDate } from "@/lib/date"
import { categoryLabel } from "@/lib/format"
import { createExpenseAction } from "@/features/expenses/actions/expense.actions"
import type { Currency, ExpenseCategory } from "@/features/expenses/domain/schemas"

import { useTripApp } from "./trip-app"

function buildEqualSplits(amount: string, memberIds: string[]) {
  if (memberIds.length === 0) return []

  const total = Number(amount)
  const share = (total / memberIds.length).toFixed(2)
  const shares = memberIds.map((memberId) => ({ memberId, share }))

  const lastIndex = shares.length - 1
  if (lastIndex >= 0) {
    const allocated = shares
      .slice(0, lastIndex)
      .reduce((sum, item) => sum + Number(item.share), 0)
    shares[lastIndex] = {
      memberId: shares[lastIndex]!.memberId,
      share: (total - allocated).toFixed(2),
    }
  }

  return shares
}

export function ExpenseFormDialog() {
  const {
    state: { trip, members, expenseDialogOpen, capabilities },
    actions: { closeExpenseDialog, invalidateExpenses },
  } = useTripApp()

  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<Currency>(trip.baseCurrency)
  const [date, setDate] = useState(todayIsoDate())
  const [category, setCategory] = useState<ExpenseCategory>("comida")
  const [payerId, setPayerId] = useState(members[0]?.id ?? "")
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
    members.map((member) => member.id),
  )
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const payerItems = members.map((member) => ({
    value: member.id,
    label: member.name,
  }))

  // Reinicia o formulário ao abrir o diálogo (padrão "ajustar estado quando uma
  // prop muda", sem efeito): https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [wasOpen, setWasOpen] = useState(false)
  if (expenseDialogOpen !== wasOpen) {
    setWasOpen(expenseDialogOpen)
    if (expenseDialogOpen) {
      setDescription("")
      setAmount("")
      setCurrency(trip.baseCurrency)
      setDate(todayIsoDate())
      setCategory("comida")
      setPayerId(members[0]?.id ?? "")
      setSelectedMemberIds(members.map((member) => member.id))
      setError(null)
    }
  }

  function toggleMember(memberId: string) {
    setSelectedMemberIds((current) =>
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId],
    )
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    if (!payerId) {
      setError("Selecione quem pagou.")
      return
    }

    if (selectedMemberIds.length === 0) {
      setError("Selecione ao menos um integrante para dividir.")
      return
    }

    startTransition(async () => {
      const result = await createExpenseAction(trip.id, {
        description,
        amount,
        currency,
        date,
        category,
        payerId,
        splits: buildEqualSplits(amount, selectedMemberIds),
      }, capabilities)

      if (!result.ok) {
        setError(result.error.message)
        return
      }

      toast.success("Gasto adicionado")
      closeExpenseDialog()
      invalidateExpenses()
    })
  }

  return (
    <Dialog
      open={expenseDialogOpen}
      onOpenChange={(open: boolean) => !open && closeExpenseDialog()}
    >
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Novo gasto</DialogTitle>
          <DialogDescription>
            Registre um gasto e divida entre os integrantes da viagem.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                inputMode="decimal"
                required
                placeholder="0,00"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Moeda</Label>
              <Select
                value={currency}
                onValueChange={(value: string | null) =>
                  value && setCurrency(value as Currency)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">BRL</SelectItem>
                  <SelectItem value="ARS">ARS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="date">Data</Label>
            <DatePicker
              id="date"
              mode="single"
              value={date}
              onChange={(value) => {
                if (value) setDate(value)
              }}
              clearable={false}
              placeholder="Selecionar data"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              required
              placeholder="Ex.: Jantar na trattoria"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Categoria</Label>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((item) => {
                const config = CATEGORY_CONFIG[item]
                const Icon = config.icon

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      category === item
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="size-3.5" />
                    {categoryLabel(item)}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Quem pagou</Label>
            <Select
              items={payerItems}
              value={payerId}
              onValueChange={(value: string | null) =>
                value && setPayerId(value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Dividir entre</Label>
            <div className="flex flex-wrap gap-2">
              {members.map((member) => {
                const selected = selectedMemberIds.includes(member.id)
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleMember(member.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {member.initials} {member.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="border-border bg-muted/40 text-muted-foreground flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center text-sm">
            <Upload className="size-5 opacity-60" />
            <p>Upload de recibo em breve</p>
          </div>

          {error ? <p className="text-destructive text-sm">{error}</p> : null}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={closeExpenseDialog}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar gasto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
