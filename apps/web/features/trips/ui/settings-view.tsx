"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import type { Member } from "@/features/members/domain/models"
import { MembersView } from "@/features/members/ui/members-view"
import type { Trip } from "@/features/trips/domain/models"
import { TripSettingsForm } from "@/features/trips/ui/components/trip-settings-form"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

type SettingsTab = "trip" | "members"

type SettingsViewProps = {
  trip: Trip
  capabilities: TripCapabilities
  initialMembers: Member[]
}

const TABS: { id: SettingsTab; label: string }[] = [
  { id: "trip", label: "Viagem" },
  { id: "members", label: "Integrantes" },
]

export function SettingsView({
  trip,
  capabilities,
  initialMembers,
}: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("trip")

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-muted inline-flex w-fit rounded-lg p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "trip" ? (
        <TripSettingsForm trip={trip} capabilities={capabilities} />
      ) : (
        <MembersView
          tripId={trip.id}
          capabilities={capabilities}
          initialMembers={initialMembers}
        />
      )}
    </div>
  )
}
