"use client"

import { ArrowRight, CheckCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import type { Currency } from "@/features/expenses/domain/schemas"
import { useDivisionApp } from "@/features/settlements/ui/division-provider"
import { formatMoney } from "@/lib/format"
import { cn } from "@/lib/utils"

type DivisionViewProps = {
  currency: Currency
}

function Avatar({ initials }: { initials: string }) {
  return (
    <span className="border-border bg-secondary text-foreground grid size-8 shrink-0 place-items-center rounded-full border text-[11px] font-semibold">
      {initials}
    </span>
  )
}

export function DivisionView({ currency }: DivisionViewProps) {
  const {
    state: { capabilities },
    meta: { query, mutations },
  } = useDivisionApp()

  const money = (value: number) => formatMoney(value, currency)

  const balances = query.balances.data ?? []
  const settlements = query.suggested.data ?? []
  const settled = settlements.length === 0

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Saldo por pessoa
          </CardTitle>
          <CardDescription>
            quem pagou mais ou menos que sua parte
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-1">
          <div>
            {balances.map((balance) => (
              <div
                key={balance.memberId}
                className="border-border flex items-center gap-3 border-b py-3 last:border-b-0"
              >
                <Avatar initials={balance.initials} />
                <div className="min-w-0">
                  <p className="text-[13.5px] font-medium">
                    {balance.memberName}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    pagou {money(balance.paid)} · parte {money(balance.owed)}
                  </p>
                </div>
                <span
                  className={cn(
                    "tnum ml-auto text-sm font-semibold",
                    balance.balance > 0.01
                      ? "text-green-700"
                      : balance.balance < -0.01
                        ? "text-destructive"
                        : "text-muted-foreground",
                  )}
                >
                  {balance.balance > 0.01 ? "+" : ""}
                  {money(balance.balance)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Como acertar</CardTitle>
          <CardDescription>menor número de transferências</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5">
          {settled ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              Tudo certo — ninguém deve nada.
            </p>
          ) : (
            <>
              {settlements.map((item, index) => (
                <div
                  key={`${item.fromMemberId}-${item.toMemberId}-${index}`}
                  className="border-border bg-card flex items-center gap-3 rounded-lg border px-4 py-3"
                >
                  <span className="text-[13.5px] font-medium">
                    {item.fromMemberName}
                  </span>
                  <ArrowRight className="text-muted-foreground size-4" />
                  <span className="text-[13.5px] font-medium">
                    {item.toMemberName}
                  </span>
                  <span className="tnum ml-auto text-sm font-semibold">
                    {money(item.amount)}
                  </span>
                </div>
              ))}
              {capabilities.canManageSettlements ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1 self-start"
                  disabled={mutations.settleMutation.isPending}
                  onClick={() => mutations.settleMutation.mutate(settlements)}
                >
                  {mutations.settleMutation.isPending ? null : (
                    <CheckCheck data-icon="inline-start" />
                  )}
                  {mutations.settleMutation.isPending
                    ? "Registrando..."
                    : "Marcar como quitado"}
                  {mutations.settleMutation.isPending ? (
                    <Spinner data-icon="inline-end" />
                  ) : null}
                </Button>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
