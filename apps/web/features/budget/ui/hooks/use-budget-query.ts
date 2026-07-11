"use client"

import { useQuery } from "@tanstack/react-query"

import { getBudgetSummaryAction } from "@/features/budget/actions/budget.actions"
import type { BudgetSummary } from "@/features/budget/domain/models"
import { budgetKeys } from "@/features/budget/ui/query-keys"

export function useBudgetQuery(tripId: string, initialData?: BudgetSummary) {
  return useQuery({
    queryKey: budgetKeys.summary(tripId),
    queryFn: async () => {
      const result = await getBudgetSummaryAction(tripId)
      if (!result.ok) {
        throw new Error(result.error.message)
      }
      return result.data
    },
    initialData,
  })
}
