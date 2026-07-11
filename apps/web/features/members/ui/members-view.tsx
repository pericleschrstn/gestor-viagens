"use client"

import type { Member } from "@/features/members/domain/models"
import { MembersList } from "@/features/members/ui/components/members-list"
import { Members } from "@/features/members/ui/members-provider"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

type MembersViewProps = {
  tripId: string
  capabilities: TripCapabilities
  initialMembers: Member[]
}

export function MembersView({
  tripId,
  capabilities,
  initialMembers,
}: MembersViewProps) {
  return (
    <Members.Provider
      tripId={tripId}
      capabilities={capabilities}
      initialMembers={initialMembers}
    >
      <Members.Frame>
        <MembersList />
      </Members.Frame>
    </Members.Provider>
  )
}
