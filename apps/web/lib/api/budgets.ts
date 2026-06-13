import { serverFetch } from "@/lib/api/server"
import type { TripSummary } from "@/lib/api/types"

export async function getTripSummary(tripId: string): Promise<TripSummary> {
  return serverFetch<TripSummary>(`/trips/${tripId}/summary`)
}
