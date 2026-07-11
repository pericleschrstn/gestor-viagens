import type {
  MemberBalance,
  SettleCommand,
  SuggestedSettlement,
} from "@/features/settlements/domain/models"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

export interface SettlementsRepository {
  getBalances(tripId: string): Promise<MemberBalance[]>
  getSuggestedSettlements(tripId: string): Promise<SuggestedSettlement[]>
  settle(tripId: string, command: SettleCommand): Promise<void>
  getTripAccess(tripId: string): Promise<TripCapabilities>
}
