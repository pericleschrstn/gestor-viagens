import type {
  CreateTripCommand,
  UpdateTripCommand,
} from "@/features/trips/domain/models"
import type { TripRepository } from "@/features/trips/domain/repository.interface"
import { tripRepository } from "@/features/trips/infra/trips.repository"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

export class TripsService {
  constructor(private readonly repository: TripRepository = tripRepository) {}

  listTrips() {
    return this.repository.list()
  }

  getTrip(tripId: string) {
    return this.repository.getById(tripId)
  }

  getSummary(tripId: string) {
    return this.repository.getSummary(tripId)
  }

  createTrip(command: CreateTripCommand) {
    return this.repository.create(command)
  }

  updateTrip(
    tripId: string,
    command: UpdateTripCommand,
    capabilities: TripCapabilities,
  ) {
    if (!capabilities.canDeleteTrip) {
      throw new Error("Sem permissão para editar a viagem.")
    }
    return this.repository.update(tripId, command)
  }

  deleteTrip(tripId: string, capabilities: TripCapabilities) {
    if (!capabilities.canDeleteTrip) {
      throw new Error("Sem permissão para excluir a viagem.")
    }
    return this.repository.delete(tripId)
  }
}

export const tripsService = new TripsService()
