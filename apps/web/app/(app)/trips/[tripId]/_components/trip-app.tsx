"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import type { AuthUser } from "@/features/auth/domain/models"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"
import { expenseKeys } from "@/features/expenses/ui/query-keys"
import type { Trip, TripMember, TripSummary } from "@/features/trips/domain/models"
import { categoryLabel, formatMoney, formatTripDates } from "@/lib/format"

type TripAppState = {
  trip: Trip
  trips: Trip[]
  summary: TripSummary
  members: TripMember[]
  user: AuthUser
  capabilities: TripCapabilities
  expenseDialogOpen: boolean
}

type TripAppActions = {
  openExpenseDialog: () => void
  closeExpenseDialog: () => void
  refresh: () => void
  invalidateExpenses: () => void
}

type TripAppMeta = {
  formatMoney: (value: number) => string
  formatTripDates: (start: string, end: string) => string
  categoryLabel: typeof categoryLabel
}

type TripAppContextValue = {
  state: TripAppState
  actions: TripAppActions
  meta: TripAppMeta
}

const TripAppContext = createContext<TripAppContextValue | null>(null)

export function useTripApp() {
  const context = useContext(TripAppContext)
  if (!context) {
    throw new Error("useTripApp must be used within TripAppProvider")
  }
  return context
}

type TripAppProviderProps = {
  trip: Trip
  trips: Trip[]
  summary: TripSummary
  members: TripMember[]
  user: AuthUser
  capabilities: TripCapabilities
  children: ReactNode
}

function TripAppProvider({
  trip,
  trips,
  summary,
  members,
  user,
  capabilities,
  children,
}: TripAppProviderProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)

  const value = useMemo<TripAppContextValue>(
    () => ({
      state: {
        trip,
        trips,
        summary,
        members,
        user,
        capabilities,
        expenseDialogOpen,
      },
      actions: {
        openExpenseDialog: () => setExpenseDialogOpen(true),
        closeExpenseDialog: () => setExpenseDialogOpen(false),
        refresh: () => router.refresh(),
        invalidateExpenses: () =>
          void queryClient.invalidateQueries({ queryKey: expenseKeys.all }),
      },
      meta: {
        formatMoney: (value: number) => formatMoney(value, summary.currency),
        formatTripDates,
        categoryLabel,
      },
    }),
    [
      trip,
      trips,
      summary,
      members,
      user,
      capabilities,
      expenseDialogOpen,
      router,
      queryClient,
    ],
  )

  return <TripAppContext value={value}>{children}</TripAppContext>
}

function TripAppContent({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 lg:px-6 lg:py-6">
      {children}
    </div>
  )
}

export const TripApp = {
  Provider: TripAppProvider,
  Content: TripAppContent,
}
