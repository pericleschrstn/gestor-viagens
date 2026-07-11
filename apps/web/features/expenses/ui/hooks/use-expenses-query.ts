"use client"

import { useQuery } from "@tanstack/react-query"

import { listExpensesAction } from "@/features/expenses/actions/expense.actions"
import type { ListExpensesFilters } from "@/features/expenses/domain/models"
import { expenseKeys } from "@/features/expenses/ui/query-keys"

export function useExpensesQuery(tripId: string, filters: ListExpensesFilters = {}) {
  return useQuery({
    queryKey: expenseKeys.list(tripId, filters),
    queryFn: async () => {
      const result = await listExpensesAction(tripId, filters)
      if (!result.ok) {
        throw new Error(result.error.message)
      }
      return result.data
    },
  })
}
