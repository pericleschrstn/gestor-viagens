"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useExpensesApp } from "@/features/expenses/ui/expenses-provider"
import { formatMoney } from "@/lib/format"

export function ExpensesSummary() {
  const {
    meta: { query },
  } = useExpensesApp()

  const total = query.data?.total ?? 0
  const items = query.data?.items ?? []
  const sum = items.reduce((acc, item) => acc + item.amount, 0)
  const currency = items[0]?.currency ?? "BRL"

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Total de gastos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{total}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Soma (página atual)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{formatMoney(sum, currency)}</p>
        </CardContent>
      </Card>
    </div>
  )
}
