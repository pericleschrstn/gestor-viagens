import { cache } from "react"

import { serverFetch } from "@/lib/api/server"
import type { Trip } from "@/lib/api/types"

export const listTrips = cache(async (): Promise<Trip[]> => {
  return serverFetch<Trip[]>("/trips")
})

export async function getTrip(id: string): Promise<Trip> {
  return serverFetch<Trip>(`/trips/${id}`)
}
