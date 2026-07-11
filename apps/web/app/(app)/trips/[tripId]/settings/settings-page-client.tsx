"use client"

import { SettingsView } from "@/features/trips/ui/settings-view"
import type { Member } from "@/features/members/domain/models"
import type { Trip } from "@/features/trips/domain/models"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

type SettingsPageClientProps = {
  trip: Trip
  capabilities: TripCapabilities
  initialMembers: Member[]
}

export function SettingsPageClient({
  trip,
  capabilities,
  initialMembers,
}: SettingsPageClientProps) {
  return (
    <SettingsView
      trip={trip}
      capabilities={capabilities}
      initialMembers={initialMembers}
    />
  )
}
