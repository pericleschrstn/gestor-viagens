"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CATEGORY_CHART_COLORS } from "@/lib/categories"
import { categoryLabel } from "@/lib/format"

import { useTripApp } from "../trip-app"

export function CategoryDonut() {
  const {
    state: { summary },
    meta: { formatMoney },
  } = useTripApp()

  const categoriesWithSpent = summary.byCategory.filter((item) => item.spent > 0)
  const total = categoriesWithSpent.reduce((sum, item) => sum + item.spent, 0)

  let cumulative = 0
  const segments = categoriesWithSpent.map((item) => {
    const start = (cumulative / Math.max(total, 1)) * 100
    cumulative += item.spent
    const end = (cumulative / Math.max(total, 1)) * 100
    return {
      ...item,
      start,
      end,
      color: CATEGORY_CHART_COLORS[item.category],
    }
  })

  const gradient =
    segments.length > 0
      ? `conic-gradient(${segments
          .map(
            (seg) =>
              `${seg.color} ${seg.start.toFixed(1)}% ${seg.end.toFixed(1)}%`,
          )
          .join(", ")})`
      : "conic-gradient(var(--muted) 0% 100%)"

  const budgetPercent =
    summary.totalBudget && summary.totalBudget > 0
      ? Math.round((summary.totalSpent / summary.totalBudget) * 100)
      : null

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Gastos por categoria
        </CardTitle>
        <CardDescription>
          distribuição do total gasto até agora
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative size-[168px] shrink-0">
            <div
              className="size-full rounded-full"
              style={{ background: gradient }}
            />
            <div className="bg-card absolute inset-4 flex flex-col items-center justify-center rounded-full text-center">
              <p className="tnum text-3xl font-semibold tracking-tight">
                {budgetPercent !== null ? `${budgetPercent}%` : "—"}
              </p>
              <p className="text-muted-foreground text-[11.5px]">
                do orçamento
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2.5">
            {categoriesWithSpent.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Nenhum gasto registrado ainda.
              </p>
            ) : (
              categoriesWithSpent.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center gap-2.5 text-[13px]"
                >
                  <div
                    className="size-2.5 shrink-0 rounded-sm"
                    style={{
                      background: CATEGORY_CHART_COLORS[item.category],
                    }}
                  />
                  <span className="flex-1">{categoryLabel(item.category)}</span>
                  <span className="tnum font-medium">
                    {formatMoney(item.spent)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
