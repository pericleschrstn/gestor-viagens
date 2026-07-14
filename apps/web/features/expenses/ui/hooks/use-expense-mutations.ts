"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { budgetKeys } from "@/features/budget/ui/query-keys"
import {
  createExpenseAction,
  deleteExpenseAction,
} from "@/features/expenses/actions/expense.actions"
import type {
  CreateExpenseCommand,
  Expense,
  PaginatedExpenses,
} from "@/features/expenses/domain/models"
import { expenseKeys } from "@/features/expenses/ui/query-keys"
import { settlementKeys } from "@/features/settlements/ui/query-keys"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

export function useExpenseMutations(tripId: string, capabilities: TripCapabilities) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: [...expenseKeys.all, tripId] })
    void queryClient.invalidateQueries({ queryKey: budgetKeys.summary(tripId) })
    void queryClient.invalidateQueries({ queryKey: settlementKeys.trip(tripId) })
    router.refresh()
  }

  const createMutation = useMutation({
    mutationFn: async (command: CreateExpenseCommand) => {
      const result = await createExpenseAction(tripId, command, capabilities)
      if (!result.ok) throw new Error(result.error.message)
      return result.data
    },
    onSuccess: () => {
      toast.success("Gasto adicionado")
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (expenseId: string) => {
      const result = await deleteExpenseAction(expenseId, capabilities)
      if (!result.ok) throw new Error(result.error.message)
    },
    onMutate: async (expenseId) => {
      await queryClient.cancelQueries({ queryKey: [...expenseKeys.all, tripId] })
      const previous = queryClient.getQueriesData<PaginatedExpenses>({
        queryKey: [...expenseKeys.all, tripId],
      })

      queryClient.setQueriesData<PaginatedExpenses>(
        { queryKey: [...expenseKeys.all, tripId] },
        (old) => {
          if (!old) return old
          return {
            ...old,
            items: old.items.filter((item) => item.id !== expenseId),
            total: Math.max(0, old.total - 1),
          }
        },
      )

      return { previous }
    },
    onError: (error: Error, _id, context) => {
      if (context?.previous) {
        for (const [key, data] of context.previous) {
          queryClient.setQueryData(key, data)
        }
      }
      toast.error(error.message)
    },
    onSuccess: () => toast.success("Gasto removido"),
    onSettled: () => invalidate(),
  })

  return { createMutation, deleteMutation }
}

export type { Expense }
