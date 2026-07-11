"use client"

import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CATEGORY_CONFIG } from "@/lib/categories"
import { categoryLabel, formatShortDate } from "@/lib/format"
import { tripViewHref } from "@/lib/trip-routes"

import { useTripApp } from "../trip-app"

export function RecentExpenses() {
  const {
    state: { trip, summary },
    meta: { formatMoney },
  } = useTripApp()

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-sm font-medium">Gastos recentes</CardTitle>
          <CardDescription>Últimos lançamentos da viagem</CardDescription>
        </div>
        <Link
          href={tripViewHref(trip.id, "expenses")}
          className="text-muted-foreground hover:text-foreground text-xs transition-colors"
        >
          Ver todos
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {summary.recent.length === 0 ? (
          <p className="text-muted-foreground px-6 pb-6 text-sm">
            Nenhum gasto registrado ainda.
          </p>
        ) : (
          <div className="divide-border divide-y">
            {summary.recent.map((expense) => {
              const config = CATEGORY_CONFIG[expense.category]
              const Icon = config.icon

              return (
                <div
                  key={expense.id}
                  className="hover:bg-muted/50 flex items-center gap-3 px-6 py-3.5 transition-colors"
                >
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${config.color}`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium">
                      {expense.description}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {categoryLabel(expense.category)} ·{" "}
                      {expense.payer?.name ?? "—"} ·{" "}
                      {formatShortDate(expense.date)}
                    </p>
                  </div>
                  <p className="tnum shrink-0 text-[13.5px] font-semibold">
                    {formatMoney(Number(expense.amount))}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
