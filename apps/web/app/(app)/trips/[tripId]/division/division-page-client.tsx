"use client"

import type {
  MemberBalance,
  SuggestedSettlement,
} from "@/features/settlements/domain/models"
import { Division } from "@/features/settlements/ui/division-provider"
import { DivisionView } from "@/features/settlements/ui/division-view"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

import { useTripApp } from "../_components/trip-app"

type DivisionPageClientProps = {
  capabilities: TripCapabilities
  initialBalances: MemberBalance[]
  initialSettlements: SuggestedSettlement[]
}

export function DivisionPageClient({
  capabilities,
  initialBalances,
  initialSettlements,
}: DivisionPageClientProps) {
  const {
    state: { trip },
  } = useTripApp()

  return (
    <Division.Provider
      tripId={trip.id}
      capabilities={capabilities}
      initialBalances={initialBalances}
      initialSettlements={initialSettlements}
    >
      <Division.Frame>
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight">Divisão</h2>
          <p className="text-muted-foreground text-[13.5px]">
            saldos e a forma mais simples de acertar as contas
          </p>
        </div>
        <DivisionView currency={trip.baseCurrency} />
      </Division.Frame>
    </Division.Provider>
  )
}
