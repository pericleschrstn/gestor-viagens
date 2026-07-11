"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
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
import type { BudgetSummary } from "@/features/budget/domain/models"
import { useBudgetApp } from "@/features/budget/ui/budget-provider"
import { ALL_CATEGORIES, CATEGORY_CONFIG } from "@/lib/categories"
import { categoryLabel } from "@/lib/format"
import { cn } from "@/lib/utils"

type EditBudgetDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  summary: BudgetSummary
}

function toInput(value: number | null): string {
  return value === null ? "" : String(value)
}

export function EditBudgetDialog({
  open,
  onOpenChange,
  summary,
}: EditBudgetDialogProps) {
  const {
    meta: { mutations },
  } = useBudgetApp()

  const [totalBudget, setTotalBudget] = useState("")
  const [limits, setLimits] = useState<Record<string, string>>({})

  // Semeia o formulário ao abrir o diálogo (padrão "ajustar estado quando uma
  // prop muda", sem efeito): https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [wasOpen, setWasOpen] = useState(false)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setTotalBudget(toInput(summary.totalBudget))
      setLimits(
        Object.fromEntries(
          summary.categories.map((item) => [item.category, toInput(item.limit)]),
        ),
      )
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const categories = ALL_CATEGORIES.flatMap((category) => {
      const raw = (limits[category] ?? "").trim()
      if (raw === "") return []
      return [{ category, limitAmount: Number(raw).toFixed(2) }]
    })

    const trimmedTotal = totalBudget.trim()

    mutations.updateMutation.mutate(
      {
        totalBudget:
          trimmedTotal === "" ? undefined : Number(trimmedTotal).toFixed(2),
        categories,
      },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  const isPending = mutations.updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Editar orçamento</DialogTitle>
          <DialogDescription>
            Defina o total da viagem e limites por categoria.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="total-budget">Orçamento total</Label>
            <Input
              id="total-budget"
              inputMode="decimal"
              placeholder="0,00"
              value={totalBudget}
              onChange={(event) => setTotalBudget(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Label>Limites por categoria</Label>
            {ALL_CATEGORIES.map((category) => {
              const config = CATEGORY_CONFIG[category]
              const Icon = config.icon
              return (
                <div key={category} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-md",
                      config.color,
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="text-[13.5px]">
                    {categoryLabel(category)}
                  </span>
                  <Input
                    className="ml-auto w-32"
                    inputMode="decimal"
                    placeholder="sem limite"
                    value={limits[category] ?? ""}
                    onChange={(event) =>
                      setLimits((current) => ({
                        ...current,
                        [category]: event.target.value,
                      }))
                    }
                  />
                </div>
              )
            })}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
