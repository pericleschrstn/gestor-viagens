import { cache } from "react"
import { z } from "zod"

import { serverFetch } from "@/features/shared/infra/http-client"

import type { TripRepository } from "@/features/trips/domain/repository.interface"
import {
  apiTripMemberSchema,
  apiTripSchema,
  apiTripSummarySchema,
  mapTrip,
  mapTripMember,
  mapTripSummary,
} from "@/features/trips/infra/mappers"

// React `cache` deduplica a listagem de viagens dentro de uma mesma requisição
// (app shell + layout da viagem chamam `list()` no mesmo render).
const fetchTrips = cache(async () => {
  const raw = await serverFetch<unknown>("/trips")
  return z.array(apiTripSchema).parse(raw).map(mapTrip)
})

export class HttpTripRepository implements TripRepository {
  list() {
    return fetchTrips()
  }

  async getById(tripId: string) {
    const raw = await serverFetch<unknown>(`/trips/${tripId}`)
    return mapTrip(apiTripSchema.parse(raw))
  }

  async getSummary(tripId: string) {
    const raw = await serverFetch<unknown>(`/trips/${tripId}/summary`)
    return mapTripSummary(apiTripSummarySchema.parse(raw))
  }

  async listMembers(tripId: string) {
    const raw = await serverFetch<unknown>(`/trips/${tripId}/members`)
    return z.array(apiTripMemberSchema).parse(raw).map(mapTripMember)
  }
}

export const tripRepository = new HttpTripRepository()
