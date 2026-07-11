import { serverFetch } from "@/features/shared/infra/http-client"

import type { SettleCommand } from "@/features/settlements/domain/models"
import type { SettlementsRepository } from "@/features/settlements/domain/repository.interface"
import {
  apiBalancesSchema,
  apiSettlementsSchema,
  mapBalance,
  mapSettlement,
} from "@/features/settlements/infra/mappers"
import {
  apiTripAccessSchema,
  mapTripAccess,
} from "@/features/shared/infra/access.mapper"

export class HttpSettlementsRepository implements SettlementsRepository {
  async getBalances(tripId: string) {
    const raw = await serverFetch<unknown>(`/trips/${tripId}/balances`)
    return apiBalancesSchema.parse(raw).map(mapBalance)
  }

  async getSuggestedSettlements(tripId: string) {
    const raw = await serverFetch<unknown>(`/trips/${tripId}/settlements`)
    return apiSettlementsSchema.parse(raw).map(mapSettlement)
  }

  async settle(tripId: string, command: SettleCommand) {
    await serverFetch<void>(`/trips/${tripId}/settlements/settle`, {
      method: "POST",
      body: JSON.stringify(command),
    })
  }

  async getTripAccess(tripId: string) {
    const raw = await serverFetch<unknown>(`/trips/${tripId}/access`)
    return mapTripAccess(apiTripAccessSchema.parse(raw))
  }
}

export const settlementsRepository = new HttpSettlementsRepository()
