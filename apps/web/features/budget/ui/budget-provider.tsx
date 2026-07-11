"use client"

import { createContext, use, useMemo, type ReactNode } from "react"

import type { BudgetSummary } from "@/features/budget/domain/models"
import { useBudgetMutations } from "@/features/budget/ui/hooks/use-budget-mutations"
import { useBudgetQuery } from "@/features/budget/ui/hooks/use-budget-query"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

type BudgetState = {
  tripId: string
  capabilities: TripCapabilities
}

type BudgetMeta = {
  query: ReturnType<typeof useBudgetQuery>
  mutations: ReturnType<typeof useBudgetMutations>
}

type BudgetContextValue = {
  state: BudgetState
  meta: BudgetMeta
}

const BudgetContext = createContext<BudgetContextValue | null>(null)

export function useBudgetApp() {
  const context = use(BudgetContext)
  if (!context) {
    throw new Error("useBudgetApp must be used within Budget.Provider")
  }
  return context
}

type BudgetProviderProps = {
  tripId: string
  capabilities: TripCapabilities
  initialSummary: BudgetSummary
  children: ReactNode
}

function BudgetProvider({
  tripId,
  capabilities,
  initialSummary,
  children,
}: BudgetProviderProps) {
  const query = useBudgetQuery(tripId, initialSummary)
  const mutations = useBudgetMutations(tripId, capabilities)

  const value = useMemo<BudgetContextValue>(
    () => ({
      state: { tripId, capabilities },
      meta: { query, mutations },
    }),
    [tripId, capabilities, query, mutations],
  )

  return <BudgetContext value={value}>{children}</BudgetContext>
}

function BudgetFrame({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>
}

export const Budget = {
  Provider: BudgetProvider,
  Frame: BudgetFrame,
}
