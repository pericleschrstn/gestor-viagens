import { redirect } from "next/navigation"

import { authService } from "@/features/auth/application/auth.service"
import { isUnauthorized } from "@/features/shared/domain/errors"
import { tripsService } from "@/features/trips/application/trips.service"

import { HomeEmptyState } from "./home-empty-state"

export default async function HomePage() {
  const user = await authService.getSession()
  if (!user) {
    redirect("/login")
  }

  let trips
  try {
    trips = await tripsService.listTrips()
  } catch (error) {
    if (isUnauthorized(error)) {
      redirect("/login")
    }
    throw error
  }

  if (trips.length > 0) {
    const firstTrip = trips[0]!
    redirect(`/trips/${firstTrip.id}/dashboard`)
  }

  const firstName = (user.name.split(" ")[0] ?? user.name) || user.name

  return <HomeEmptyState userName={firstName} />
}
