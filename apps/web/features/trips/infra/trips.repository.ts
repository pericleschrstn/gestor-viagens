import { cache } from "react"
import { z } from "zod"

import type {
  CreateTripCommand,
  UpdateTripCommand,
} from "@/features/trips/domain/models"
import type { TripRepository } from "@/features/trips/domain/repository.interface"
import {
  apiTripSchema,
  apiTripSummarySchema,
  createTripCommandSchema,
  mapTrip,
  mapTripSummary,
  updateTripCommandSchema,
} from "@/features/trips/infra/mappers"
import { serverFetch } from "@/features/shared/infra/http-client"

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

  async create(command: CreateTripCommand) {
    const raw = await serverFetch<unknown>("/trips", {
      method: "POST",
      body: JSON.stringify(createTripCommandSchema.parse(command)),
    })
    return mapTrip(apiTripSchema.parse(raw))
  }

  async update(tripId: string, command: UpdateTripCommand) {
    const raw = await serverFetch<unknown>(`/trips/${tripId}`, {
      method: "PATCH",
      body: JSON.stringify(updateTripCommandSchema.parse(command)),
    })
    return mapTrip(apiTripSchema.parse(raw))
  }

  async delete(tripId: string) {
    await serverFetch<unknown>(`/trips/${tripId}`, { method: "DELETE" })
  }
}

export const tripRepository = new HttpTripRepository()
