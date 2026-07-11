import type { CreateTripCommand, Trip, TripSummary, UpdateTripCommand } from "@/features/trips/domain/models"

export interface TripRepository {
  list(): Promise<Trip[]>
  getById(tripId: string): Promise<Trip>
  getSummary(tripId: string): Promise<TripSummary>
  create(command: CreateTripCommand): Promise<Trip>
  update(tripId: string, command: UpdateTripCommand): Promise<Trip>
  delete(tripId: string): Promise<void>
}
