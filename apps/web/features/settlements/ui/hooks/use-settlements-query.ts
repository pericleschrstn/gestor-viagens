"use client"

import { useQuery } from "@tanstack/react-query"

import {
  getBalancesAction,
  getSuggestedSettlementsAction,
} from "@/features/settlements/actions/settlements.actions"
import type {
  MemberBalance,
  SuggestedSettlement,
} from "@/features/settlements/domain/models"
import { settlementKeys } from "@/features/settlements/ui/query-keys"

type InitialData = {
  balances: MemberBalance[]
  suggested: SuggestedSettlement[]
}

export function useSettlementsQuery(tripId: string, initialData: InitialData) {
  const balances = useQuery({
    queryKey: settlementKeys.balances(tripId),
    queryFn: async () => {
      const result = await getBalancesAction(tripId)
      if (!result.ok) throw new Error(result.error.message)
      return result.data
    },
    initialData: initialData.balances,
  })

  const suggested = useQuery({
    queryKey: settlementKeys.suggested(tripId),
    queryFn: async () => {
      const result = await getSuggestedSettlementsAction(tripId)
      if (!result.ok) throw new Error(result.error.message)
      return result.data
    },
    initialData: initialData.suggested,
  })

  return { balances, suggested }
}
