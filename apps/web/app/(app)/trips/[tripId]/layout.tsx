import { notFound, redirect } from "next/navigation"

import { authService } from "@/features/auth/application/auth.service"
import { expensesService } from "@/features/expenses/application/expenses.service"
import { membersService } from "@/features/members/application/members.service"
import { isNotFound, isUnauthorized } from "@/features/shared/domain/errors"
import { tripsService } from "@/features/trips/application/trips.service"

import { TripLayoutClient } from "./trip-layout-client"

type TripLayoutProps = {
  children: React.ReactNode
  params: Promise<{ tripId: string }>
}

async function loadTripLayout(tripId: string) {
  const [trips, trip, summary, members, user, capabilities] = await Promise.all([
    tripsService.listTrips(),
    tripsService.getTrip(tripId),
    tripsService.getSummary(tripId),
    membersService.listMembers(tripId),
    authService.getSession(),
    expensesService.getTripAccess(tripId),
  ])

  if (!user) {
    redirect("/login")
  }

  return { trips, trip, summary, members, user, capabilities }
}

export default async function TripLayout({ children, params }: TripLayoutProps) {
  const { tripId } = await params

  let data: Awaited<ReturnType<typeof loadTripLayout>>
  try {
    data = await loadTripLayout(tripId)
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
    <TripLayoutClient
      trip={data.trip}
      trips={data.trips}
      summary={data.summary}
      members={data.members}
      user={data.user}
      capabilities={data.capabilities}
    >
      {children}
    </TripLayoutClient>
  )
}
