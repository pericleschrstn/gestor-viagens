"use server"

import { tripsService } from "@/features/trips/application/trips.service"
import type {
  CreateTripCommand,
  Trip,
  UpdateTripCommand,
} from "@/features/trips/domain/models"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"
import { mapApiErrorToDomain } from "@/features/shared/domain/errors"
import type { Result } from "@/features/shared/domain/result"
import { ok } from "@/features/shared/domain/result"

export async function createTripAction(
  command: CreateTripCommand,
): Promise<Result<Trip>> {
  try {
    const data = await tripsService.createTrip(command)
    return ok(data)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}

export async function updateTripAction(
  tripId: string,
  command: UpdateTripCommand,
  capabilities: TripCapabilities,
): Promise<Result<Trip>> {
  try {
    const data = await tripsService.updateTrip(tripId, command, capabilities)
    return ok(data)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}

export async function deleteTripAction(
  tripId: string,
  capabilities: TripCapabilities,
): Promise<Result<void>> {
  try {
    await tripsService.deleteTrip(tripId, capabilities)
    return ok(undefined)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}
