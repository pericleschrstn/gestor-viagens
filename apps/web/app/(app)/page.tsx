import { redirect } from "next/navigation"

import { getSession } from "@/lib/api/auth"
import { isUnauthorized } from "@/lib/api/errors"
import { listTrips } from "@/lib/api/trips"

import { HomeEmptyState } from "./home-empty-state"

export default async function HomePage() {
  const user = await getSession()
  if (!user) {
    redirect("/login")
  }

  let trips
  try {
    trips = await listTrips()
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
