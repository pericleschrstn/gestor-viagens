"use client"

import { ExpensesFilters } from "@/features/expenses/ui/components/expenses-filters"
import { ExpensesList } from "@/features/expenses/ui/components/expenses-list"
import { ExpensesSummary } from "@/features/expenses/ui/components/expenses-summary"
import { Expenses } from "@/features/expenses/ui/expenses-provider"
import type { ExpenseMember } from "@/features/expenses/domain/models"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

type ExpensesViewProps = {
  tripId: string
  tripName: string
  members: ExpenseMember[]
  capabilities: TripCapabilities
}

export function ExpensesView({
  tripId,
  tripName,
  members,
  capabilities,
}: ExpensesViewProps) {
  return (
    <Expenses.Provider
      tripId={tripId}
      members={members}
      capabilities={capabilities}
    >
      <Expenses.Frame>
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[22px] font-semibold tracking-tight">Gastos</h2>
            <p className="text-muted-foreground text-[13.5px]">
              Todos os gastos de {tripName}
            </p>
          </div>
        </div>
        <ExpensesSummary />
        <ExpensesFilters />
        <ExpensesList />
      </Expenses.Frame>
    </Expenses.Provider>
  )
}
