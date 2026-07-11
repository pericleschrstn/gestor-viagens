import { serverFetch } from "@/features/shared/infra/http-client"

import type { UpdateBudgetCommand } from "@/features/budget/domain/models"
import type { BudgetRepository } from "@/features/budget/domain/repository.interface"
import {
  apiBudgetSummarySchema,
  mapBudgetSummary,
} from "@/features/budget/infra/mappers"
import {
  apiTripAccessSchema,
  mapTripAccess,
} from "@/features/shared/infra/access.mapper"

export class HttpBudgetRepository implements BudgetRepository {
  async getSummary(tripId: string) {
    const raw = await serverFetch<unknown>(`/trips/${tripId}/summary`)
    return mapBudgetSummary(apiBudgetSummarySchema.parse(raw))
  }

  async updateBudget(tripId: string, command: UpdateBudgetCommand) {
    await serverFetch<unknown>(`/trips/${tripId}/budget`, {
      method: "PUT",
      body: JSON.stringify(command),
    })
    return this.getSummary(tripId)
  }

  async getTripAccess(tripId: string) {
    const raw = await serverFetch<unknown>(`/trips/${tripId}/access`)
    return mapTripAccess(apiTripAccessSchema.parse(raw))
  }
}

export const budgetRepository = new HttpBudgetRepository()
