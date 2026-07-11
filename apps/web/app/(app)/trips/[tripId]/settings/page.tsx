import { notFound, redirect } from "next/navigation"

import { membersService } from "@/features/members/application/members.service"
import { isNotFound, isUnauthorized } from "@/features/shared/domain/errors"
import { tripsService } from "@/features/trips/application/trips.service"

import { SettingsPageClient } from "./settings-page-client"

type TripSettingsPageProps = {
  params: Promise<{ tripId: string }>
}

async function loadSettings(tripId: string) {
  const capabilities = await membersService.getTripAccess(tripId)

  if (!capabilities.canRead) {
    notFound()
  }

  const [trip, members] = await Promise.all([
    tripsService.getTrip(tripId),
    membersService.listMembers(tripId),
  ])

  return { trip, members, capabilities }
}

export default async function TripSettingsPage({
  params,
}: TripSettingsPageProps) {
  const { tripId } = await params

  let data: Awaited<ReturnType<typeof loadSettings>>
  try {
    data = await loadSettings(tripId)
  } catch (error) {
    if (isUnauthorized(error)) {
      redirect("/login")
    }
    if (isNotFound(error)) {
      notFound()
    }
    throw error
  }

  return (
    <SettingsPageClient
      trip={data.trip}
      capabilities={data.capabilities}
      initialMembers={data.members}
    />
  )
}
