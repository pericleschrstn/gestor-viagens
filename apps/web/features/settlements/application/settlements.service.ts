import type { SettleCommand } from "@/features/settlements/domain/models"
import type { SettlementsRepository } from "@/features/settlements/domain/repository.interface"
import { settlementsRepository } from "@/features/settlements/infra/settlements.repository"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

export class SettlementsService {
  constructor(
    private readonly repository: SettlementsRepository = settlementsRepository,
  ) {}

  getBalances(tripId: string) {
    return this.repository.getBalances(tripId)
  }

  getSuggestedSettlements(tripId: string) {
    return this.repository.getSuggestedSettlements(tripId)
  }

  settle(
    tripId: string,
    command: SettleCommand,
    capabilities: TripCapabilities,
  ) {
    if (!capabilities.canManageSettlements) {
      throw new Error("Sem permissão para registrar acertos.")
    }
    return this.repository.settle(tripId, command)
  }

  getTripAccess(tripId: string) {
    return this.repository.getTripAccess(tripId)
  }
}

export const settlementsService = new SettlementsService()
