import type { Trip, TripMember, TripSummary } from "@/features/trips/domain/models"

export interface TripRepository {
  list(): Promise<Trip[]>
  getById(tripId: string): Promise<Trip>
  getSummary(tripId: string): Promise<TripSummary>
  listMembers(tripId: string): Promise<TripMember[]>
}
