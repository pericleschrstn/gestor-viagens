"use client"

import { createContext, use, useMemo, useState, type ReactNode } from "react"

import type {
  ExpenseMember,
  ListExpensesFilters,
} from "@/features/expenses/domain/models"
import { useExpenseMutations } from "@/features/expenses/ui/hooks/use-expense-mutations"
import { useExpensesQuery } from "@/features/expenses/ui/hooks/use-expenses-query"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

type ExpensesState = {
  tripId: string
  filters: ListExpensesFilters
  members: ExpenseMember[]
  capabilities: TripCapabilities
}

type ExpensesActions = {
  setFilters: (filters: ListExpensesFilters) => void
  updateFilter: <K extends keyof ListExpensesFilters>(
    key: K,
    value: ListExpensesFilters[K],
  ) => void
}

type ExpensesMeta = {
  query: ReturnType<typeof useExpensesQuery>
  mutations: ReturnType<typeof useExpenseMutations>
}

type ExpensesContextValue = {
  state: ExpensesState
  actions: ExpensesActions
  meta: ExpensesMeta
}

const ExpensesContext = createContext<ExpensesContextValue | null>(null)

export function useExpensesApp() {
  const context = use(ExpensesContext)
  if (!context) {
    throw new Error("useExpensesApp must be used within Expenses.Provider")
  }
  return context
}

type ExpensesProviderProps = {
  tripId: string
  members: ExpenseMember[]
  capabilities: TripCapabilities
  children: ReactNode
}

function ExpensesProvider({
  tripId,
  members,
  capabilities,
  children,
}: ExpensesProviderProps) {
  const [filters, setFilters] = useState<ListExpensesFilters>({
    page: 1,
    limit: 20,
    sort: "newest",
  })

  const query = useExpensesQuery(tripId, filters)
  const mutations = useExpenseMutations(tripId, capabilities)

  const value = useMemo<ExpensesContextValue>(
    () => ({
      state: { tripId, filters, members, capabilities },
      actions: {
        setFilters,
        updateFilter: (key, value) =>
          setFilters((current) => ({ ...current, [key]: value, page: 1 })),
      },
      meta: { query, mutations },
    }),
    [tripId, filters, members, capabilities, query, mutations],
  )

  return <ExpensesContext value={value}>{children}</ExpensesContext>
}

function ExpensesFrame({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-6">{children}</div>
}

export const Expenses = {
  Provider: ExpensesProvider,
  Frame: ExpensesFrame,
}
