"use client"

import { useState } from "react"
import { Pencil, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useBudgetApp } from "@/features/budget/ui/budget-provider"
import { EditBudgetDialog } from "@/features/budget/ui/components/edit-budget-dialog"
import { CATEGORY_CONFIG } from "@/lib/categories"
import { categoryLabel, formatMoney } from "@/lib/format"
import { cn } from "@/lib/utils"

type BudgetMember = {
  id: string
  initials: string
}

type BudgetViewProps = {
  members: BudgetMember[]
}

function MiniBar({ percentage, over }: { percentage: number; over: boolean }) {
  return (
    <div className="bg-data-soft h-2 w-full overflow-hidden rounded-full">
      <div
        className={cn(
          "h-full rounded-full transition-all",
          over ? "bg-destructive" : "bg-data",
        )}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  )
}

export function BudgetView({ members }: BudgetViewProps) {
  const {
    state: { capabilities },
    meta: { query },
  } = useBudgetApp()

  const [editOpen, setEditOpen] = useState(false)

  const summary = query.data

  if (!summary) {
    return (
      <Card>
        <CardContent className="text-destructive py-8 text-center text-sm">
          {query.error?.message ?? "Não foi possível carregar o orçamento."}
        </CardContent>
      </Card>
    )
  }

  const money = (value: number) => formatMoney(value, summary.currency)
  const { totalSpent, totalBudget } = summary
  const overallPct =
    totalBudget && totalBudget > 0
      ? Math.round((totalSpent / totalBudget) * 100)
      : null

  return (
    <>
      <div className="grid items-start gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total da viagem
            </CardTitle>
            <CardDescription>consumo geral do orçamento</CardDescription>
            {capabilities.canManageBudget ? (
              <CardAction>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil className="size-3.5" /> Editar
                </Button>
              </CardAction>
            ) : null}
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="tnum text-3xl font-semibold tracking-tight">
                  {money(totalSpent)}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  de {totalBudget !== null ? money(totalBudget) : "—"}
                </p>
              </div>
              <p className="tnum text-3xl font-semibold tracking-tight">
                {overallPct !== null ? `${overallPct}%` : "—"}
              </p>
            </div>
            <MiniBar
              percentage={overallPct ?? 0}
              over={overallPct !== null && overallPct > 100}
            />
            <p className="text-muted-foreground mt-3 text-[12.5px] leading-relaxed">
              {totalBudget === null
                ? "Defina um orçamento total para acompanhar a projeção da viagem."
                : "No ritmo atual, a projeção fecha dentro do previsto. Categorias no vermelho passaram do limite definido."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Dica de rateio</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="bg-secondary text-foreground grid size-9 shrink-0 place-items-center rounded-lg">
                <Sparkles className="size-[18px]" />
              </span>
              <p className="text-muted-foreground text-[12.5px] leading-snug">
                Defina limites só para as categorias que importam. As demais
                herdam o saldo do total automaticamente.
              </p>
            </div>
            <div className="bg-border h-px" />
            <div className="flex">
              {members.map((member) => (
                <span
                  key={member.id}
                  className="border-border bg-secondary text-foreground ring-card -ml-2 grid size-7 place-items-center rounded-full border text-[10.5px] font-semibold ring-2 first:ml-0"
                >
                  {member.initials}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground text-xs">
              Rateio padrão: divisão igual entre {members.length}{" "}
              {members.length === 1 ? "pessoa" : "pessoas"}.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Por categoria</CardTitle>
        </CardHeader>
        <CardContent className="pt-1">
          <div>
            {summary.categories.map((item) => {
              const config = CATEGORY_CONFIG[item.category]
              const Icon = config.icon
              const pct = item.percentage ?? 0
              const over = item.limit !== null && pct > 100
              return (
                <div
                  key={item.category}
                  className="border-border border-b py-3.5 last:border-b-0"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-md",
                        config.color,
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="text-[13.5px] font-medium">
                      {categoryLabel(item.category)}
                    </span>
                    <span className="text-muted-foreground tnum ml-auto text-[13px]">
                      {money(item.spent)}
                      {item.limit !== null ? ` / ${money(item.limit)}` : ""}
                    </span>
                  </div>
                  {item.limit !== null ? (
                    <MiniBar percentage={pct} over={over} />
                  ) : (
                    <p className="text-muted-foreground text-[11.5px]">
                      Sem limite definido
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <EditBudgetDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        summary={summary}
      />
    </>
  )
}
