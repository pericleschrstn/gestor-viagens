import { notFound, redirect } from "next/navigation"

import { getSession } from "@/lib/api/auth"
import { getTripSummary } from "@/lib/api/budgets"
import { isNotFound, isUnauthorized } from "@/lib/api/errors"
import { listMembers } from "@/lib/api/members"
import { getTrip, listTrips } from "@/lib/api/trips"

import { TripLayoutClient } from "./trip-layout-client"

type TripLayoutProps = {
  children: React.ReactNode
  params: Promise<{ tripId: string }>
}

export default async function TripLayout({ children, params }: TripLayoutProps) {
  const { tripId } = await params

  try {
    const [trips, trip, summary, members, user] = await Promise.all([
      listTrips(),
      getTrip(tripId),
      getTripSummary(tripId),
      listMembers(tripId),
      getSession(),
    ])

    if (!user) {
      redirect("/login")
    }

    return (
      <TripLayoutClient
        trip={trip}
        trips={trips}
        summary={summary}
        members={members}
        user={user}
      >
        {children}
      </TripLayoutClient>
    )
  } catch (error) {
    if (isUnauthorized(error)) {
      redirect("/login")
    }
    if (isNotFound(error)) {
      notFound()
    }
    throw error
  }
}
