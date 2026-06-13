"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatShortDate } from "@/lib/format"

import { useTripApp } from "../trip-app"

export function SpendingBars() {
  const {
    state: { summary },
    meta: { formatMoney },
  } = useTripApp()

  const entries = Object.entries(summary.byDay).sort(([a], [b]) =>
    a.localeCompare(b),
  )

  const maxValue = Math.max(...entries.map(([, value]) => value), 1)
  const recentEntries = entries.slice(-12)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Ritmo de gastos</CardTitle>
        <CardDescription>Gastos por dia da viagem</CardDescription>
      </CardHeader>
      <CardContent>
        {recentEntries.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhum gasto registrado ainda.
          </p>
        ) : (
          <div className="flex h-[120px] items-end gap-1.5">
            {recentEntries.map(([date, value], index) => {
              const height = Math.max((value / maxValue) * 100, 3)
              const isLast = index === recentEntries.length - 1

              return (
                <div
                  key={date}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                >
                  <div
                    className={cn(
                      "w-full max-w-[26px] rounded-t-md transition-all",
                      isLast ? "bg-data" : "bg-data-soft",
                    )}
                    style={{ height: `${height}%` }}
                    title={`${formatShortDate(date)}: ${formatMoney(value)}`}
                  />
                  <span className="text-muted-foreground text-[10.5px]">
                    {new Date(`${date}T12:00:00`).getDate()}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
