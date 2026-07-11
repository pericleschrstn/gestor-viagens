"use client"

import type { BudgetSummary } from "@/features/budget/domain/models"
import { Budget } from "@/features/budget/ui/budget-provider"
import { BudgetView } from "@/features/budget/ui/budget-view"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

import { useTripApp } from "../_components/trip-app"

type BudgetPageClientProps = {
  capabilities: TripCapabilities
  initialSummary: BudgetSummary
}

export function BudgetPageClient({
  capabilities,
  initialSummary,
}: BudgetPageClientProps) {
  const {
    state: { trip, members },
  } = useTripApp()

  return (
    <Budget.Provider
      tripId={trip.id}
      capabilities={capabilities}
      initialSummary={initialSummary}
    >
      <Budget.Frame>
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight">
            Orçamento
          </h2>
          <p className="text-muted-foreground text-[13.5px]">
            limites por categoria · ajuste a qualquer momento
          </p>
        </div>
        <BudgetView members={members} />
      </Budget.Frame>
    </Budget.Provider>
  )
}
