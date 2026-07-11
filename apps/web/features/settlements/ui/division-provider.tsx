"use client"

import { createContext, use, useMemo, type ReactNode } from "react"

import type {
  MemberBalance,
  SuggestedSettlement,
} from "@/features/settlements/domain/models"
import { useSettlementsMutations } from "@/features/settlements/ui/hooks/use-settlements-mutations"
import { useSettlementsQuery } from "@/features/settlements/ui/hooks/use-settlements-query"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

type DivisionState = {
  tripId: string
  capabilities: TripCapabilities
}

type DivisionMeta = {
  query: ReturnType<typeof useSettlementsQuery>
  mutations: ReturnType<typeof useSettlementsMutations>
}

type DivisionContextValue = {
  state: DivisionState
  meta: DivisionMeta
}

const DivisionContext = createContext<DivisionContextValue | null>(null)

export function useDivisionApp() {
  const context = use(DivisionContext)
  if (!context) {
    throw new Error("useDivisionApp must be used within Division.Provider")
  }
  return context
}

type DivisionProviderProps = {
  tripId: string
  capabilities: TripCapabilities
  initialBalances: MemberBalance[]
  initialSettlements: SuggestedSettlement[]
  children: ReactNode
}

function DivisionProvider({
  tripId,
  capabilities,
  initialBalances,
  initialSettlements,
  children,
}: DivisionProviderProps) {
  const query = useSettlementsQuery(tripId, {
    balances: initialBalances,
    suggested: initialSettlements,
  })
  const mutations = useSettlementsMutations(tripId, capabilities)

  const value = useMemo<DivisionContextValue>(
    () => ({
      state: { tripId, capabilities },
      meta: { query, mutations },
    }),
    [tripId, capabilities, query, mutations],
  )

  return <DivisionContext value={value}>{children}</DivisionContext>
}

function DivisionFrame({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>
}

export const Division = {
  Provider: DivisionProvider,
  Frame: DivisionFrame,
}
