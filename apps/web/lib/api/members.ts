import { serverFetch } from "@/lib/api/server"
import type { TripMember } from "@/lib/api/types"

export async function listMembers(tripId: string): Promise<TripMember[]> {
  return serverFetch<TripMember[]>(`/trips/${tripId}/members`)
}
