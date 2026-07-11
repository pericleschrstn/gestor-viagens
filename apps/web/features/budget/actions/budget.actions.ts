"use server"

import { budgetService } from "@/features/budget/application/budget.service"
import type {
  BudgetSummary,
  UpdateBudgetCommand,
} from "@/features/budget/domain/models"
import { updateBudgetCommandSchema } from "@/features/budget/infra/mappers"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"
import { mapApiErrorToDomain } from "@/features/shared/domain/errors"
import type { Result } from "@/features/shared/domain/result"
import { ok } from "@/features/shared/domain/result"

export async function getBudgetSummaryAction(
  tripId: string,
): Promise<Result<BudgetSummary>> {
  try {
    const data = await budgetService.getSummary(tripId)
    return ok(data)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}

export async function updateBudgetAction(
  tripId: string,
  command: UpdateBudgetCommand,
  capabilities: TripCapabilities,
): Promise<Result<BudgetSummary>> {
  try {
    const parsed = updateBudgetCommandSchema.parse(command)
    const data = await budgetService.updateBudget(tripId, parsed, capabilities)
    return ok(data)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}
