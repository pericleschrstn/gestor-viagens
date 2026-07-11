"use client"

import { createContext, use, useMemo, type ReactNode } from "react"

import type { Member } from "@/features/members/domain/models"
import { useMemberMutations } from "@/features/members/ui/hooks/use-member-mutations"
import { useMembersQuery } from "@/features/members/ui/hooks/use-members-query"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

type MembersState = {
  tripId: string
  capabilities: TripCapabilities
}

type MembersMeta = {
  query: ReturnType<typeof useMembersQuery>
  mutations: ReturnType<typeof useMemberMutations>
}

type MembersContextValue = {
  state: MembersState
  meta: MembersMeta
}

const MembersContext = createContext<MembersContextValue | null>(null)

export function useMembersApp() {
  const context = use(MembersContext)
  if (!context) {
    throw new Error("useMembersApp must be used within Members.Provider")
  }
  return context
}

type MembersProviderProps = {
  tripId: string
  capabilities: TripCapabilities
  initialMembers: Member[]
  children: ReactNode
}

function MembersProvider({
  tripId,
  capabilities,
  initialMembers,
  children,
}: MembersProviderProps) {
  const query = useMembersQuery(tripId, initialMembers)
  const mutations = useMemberMutations(tripId, capabilities)

  const value = useMemo<MembersContextValue>(
    () => ({
      state: { tripId, capabilities },
      meta: { query, mutations },
    }),
    [tripId, capabilities, query, mutations],
  )

  return <MembersContext value={value}>{children}</MembersContext>
}

function MembersFrame({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>
}

export const Members = {
  Provider: MembersProvider,
  Frame: MembersFrame,
}
