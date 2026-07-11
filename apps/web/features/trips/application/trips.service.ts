import type { TripRepository } from "@/features/trips/domain/repository.interface"
import { tripRepository } from "@/features/trips/infra/trips.repository"

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

  listMembers(tripId: string) {
    return this.repository.listMembers(tripId)
  }
}

export const tripsService = new TripsService()
