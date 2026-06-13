"use client"

import { TrendingDown, TrendingUp, Minus } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { useTripApp } from "../trip-app"

type KpiCardProps = {
  title: string
  value: string
  subtitle?: string
  trend?: "up" | "down" | "flat"
}

function KpiCard({ title, value, subtitle, trend }: KpiCardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="tnum text-2xl font-semibold tracking-tight">{value}</p>
        {subtitle ? (
          <p
            className={cn(
              "mt-1 flex items-center gap-1 text-xs",
              trend === "down" && "text-green-700",
              trend === "up" && "text-red-600",
              trend === "flat" && "text-muted-foreground",
            )}
          >
            <TrendIcon className="size-3" />
            {subtitle}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function KpiGrid() {
  const {
    state: { summary },
    meta: { formatMoney },
  } = useTripApp()

  const budgetUsed =
    summary.totalBudget !== null && summary.totalBudget > 0
      ? (summary.totalSpent / summary.totalBudget) * 100
      : null

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        title="Total gasto"
        value={formatMoney(summary.totalSpent)}
        subtitle={
          budgetUsed !== null
            ? `${budgetUsed.toFixed(0)}% do orçamento`
            : undefined
        }
        trend={budgetUsed !== null && budgetUsed > 80 ? "up" : "flat"}
      />
      <KpiCard
        title="Disponível"
        value={
          summary.remaining !== null
            ? formatMoney(summary.remaining)
            : "—"
        }
        subtitle={
          summary.remaining !== null && summary.remaining < 0
            ? "Acima do orçamento"
            : summary.totalBudget !== null
              ? "Restante do orçamento"
              : undefined
        }
        trend={
          summary.remaining !== null && summary.remaining < 0
            ? "up"
            : "down"
        }
      />
      <KpiCard
        title="Média diária"
        value={formatMoney(summary.dailyAverage)}
        subtitle={`${summary.elapsedDays} dias decorridos`}
        trend="flat"
      />
      <KpiCard
        title="Por pessoa"
        value={formatMoney(summary.perPerson)}
        subtitle="Média por integrante"
        trend="flat"
      />
    </div>
  )
}
