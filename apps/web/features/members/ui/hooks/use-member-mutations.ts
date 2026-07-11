"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  createMemberAction,
  deleteMemberAction,
  updateMemberAction,
} from "@/features/members/actions/member.actions"
import type {
  CreateMemberCommand,
  UpdateMemberCommand,
} from "@/features/members/domain/models"
import { memberKeys } from "@/features/members/ui/query-keys"
import { expenseKeys } from "@/features/expenses/ui/query-keys"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

export function useMemberMutations(
  tripId: string,
  capabilities: TripCapabilities,
) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: memberKeys.list(tripId) })
    void queryClient.invalidateQueries({ queryKey: expenseKeys.all })
    router.refresh()
  }

  const createMutation = useMutation({
    mutationFn: async (command: CreateMemberCommand) => {
      const result = await createMemberAction(tripId, command, capabilities)
      if (!result.ok) throw new Error(result.error.message)
      return result.data
    },
    onSuccess: () => {
      invalidate()
      toast.success("Integrante adicionado")
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const updateMutation = useMutation({
    mutationFn: async ({
      memberId,
      command,
    }: {
      memberId: string
      command: UpdateMemberCommand
    }) => {
      const result = await updateMemberAction(memberId, command, capabilities)
      if (!result.ok) throw new Error(result.error.message)
      return result.data
    },
    onSuccess: () => {
      invalidate()
      toast.success("Integrante atualizado")
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const result = await deleteMemberAction(memberId, capabilities)
      if (!result.ok) throw new Error(result.error.message)
    },
    onSuccess: () => {
      invalidate()
      toast.success("Integrante removido")
    },
    onError: (error: Error) => toast.error(error.message),
  })

  return { createMutation, updateMutation, deleteMutation }
}
