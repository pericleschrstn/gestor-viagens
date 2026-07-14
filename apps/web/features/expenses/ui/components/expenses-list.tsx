"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"

import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import type { Expense } from "@/features/expenses/domain/models"
import { useExpensesApp } from "@/features/expenses/ui/expenses-provider"
import { categoryLabel, formatDate, formatMoney } from "@/lib/format"

export function ExpensesList() {
  const {
    state: { capabilities },
    meta: { query, mutations },
  } = useExpensesApp()

  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null)

  if (query.isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (query.isError) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-destructive text-sm">{query.error.message}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => query.refetch()}
          >
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  const items = query.data?.items ?? []

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground py-12 text-center text-sm">
          Nenhum gasto encontrado.
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {items.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{expense.description}</p>
                  <Badge variant="secondary">
                    {categoryLabel(expense.category)}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {formatDate(expense.date)} · Pago por {expense.payer.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tabular-nums">
                  {formatMoney(expense.amount, expense.currency)}
                </span>
                {capabilities.canWrite ? (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    aria-label="Excluir gasto"
                    disabled={mutations.deleteMutation.isPending}
                    onClick={() => setExpenseToDelete(expense)}
                  >
                    {mutations.deleteMutation.isPending ? (
                      <Spinner />
                    ) : (
                      <Trash2 />
                    )}
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmDeleteDialog
        open={expenseToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setExpenseToDelete(null)
        }}
        title="Excluir gasto?"
        description={
          expenseToDelete
            ? `Excluir "${expenseToDelete.description}"? Esta ação não pode ser desfeita.`
            : "Esta ação não pode ser desfeita."
        }
        isPending={mutations.deleteMutation.isPending}
        onConfirm={() => {
          if (!expenseToDelete) return
          const id = expenseToDelete.id
          setExpenseToDelete(null)
          mutations.deleteMutation.mutate(id)
        }}
      />
    </>
  )
}
