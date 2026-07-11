"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { settleAction } from "@/features/settlements/actions/settlements.actions"
import type { SuggestedSettlement } from "@/features/settlements/domain/models"
import { settlementKeys } from "@/features/settlements/ui/query-keys"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

export function useSettlementsMutations(
  tripId: string,
  capabilities: TripCapabilities,
) {
  const queryClient = useQueryClient()

  const settleMutation = useMutation({
    mutationFn: async (suggested: SuggestedSettlement[]) => {
      const command = {
        settlements: suggested.map((item) => ({
          fromMemberId: item.fromMemberId,
          toMemberId: item.toMemberId,
          amount: item.amount.toFixed(2),
        })),
      }
      const result = await settleAction(tripId, command, capabilities)
      if (!result.ok) throw new Error(result.error.message)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: settlementKeys.trip(tripId),
      })
      toast.success("Acerto registrado")
    },
    onError: (error: Error) => toast.error(error.message),
  })

  return { settleMutation }
}
