"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateBudgetAction } from "@/features/budget/actions/budget.actions"
import type { UpdateBudgetCommand } from "@/features/budget/domain/models"
import { budgetKeys } from "@/features/budget/ui/query-keys"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

export function useBudgetMutations(
  tripId: string,
  capabilities: TripCapabilities,
) {
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: async (command: UpdateBudgetCommand) => {
      const result = await updateBudgetAction(tripId, command, capabilities)
      if (!result.ok) throw new Error(result.error.message)
      return result.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(budgetKeys.summary(tripId), data)
      void queryClient.invalidateQueries({ queryKey: budgetKeys.summary(tripId) })
      toast.success("Orçamento atualizado")
    },
    onError: (error: Error) => toast.error(error.message),
  })

  return { updateMutation }
}
