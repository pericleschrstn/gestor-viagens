"use client"

import { useQuery } from "@tanstack/react-query"

import { listMembersAction } from "@/features/members/actions/member.actions"
import type { Member } from "@/features/members/domain/models"
import { memberKeys } from "@/features/members/ui/query-keys"

export function useMembersQuery(tripId: string, initialMembers: Member[]) {
  return useQuery({
    queryKey: memberKeys.list(tripId),
    queryFn: async () => {
      const result = await listMembersAction(tripId)
      if (!result.ok) throw new Error(result.error.message)
      return result.data
    },
    initialData: initialMembers,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  })
}
