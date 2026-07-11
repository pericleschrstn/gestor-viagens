"use server"

import { settlementsService } from "@/features/settlements/application/settlements.service"
import type {
  MemberBalance,
  SettleCommand,
  SuggestedSettlement,
} from "@/features/settlements/domain/models"
import { settleCommandSchema } from "@/features/settlements/infra/mappers"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"
import { mapApiErrorToDomain } from "@/features/shared/domain/errors"
import type { Result } from "@/features/shared/domain/result"
import { ok } from "@/features/shared/domain/result"

export async function getBalancesAction(
  tripId: string,
): Promise<Result<MemberBalance[]>> {
  try {
    const data = await settlementsService.getBalances(tripId)
    return ok(data)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}

export async function getSuggestedSettlementsAction(
  tripId: string,
): Promise<Result<SuggestedSettlement[]>> {
  try {
    const data = await settlementsService.getSuggestedSettlements(tripId)
    return ok(data)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}

export async function settleAction(
  tripId: string,
  command: SettleCommand,
  capabilities: TripCapabilities,
): Promise<Result<void>> {
  try {
    const parsed = settleCommandSchema.parse(command)
    await settlementsService.settle(tripId, parsed, capabilities)
    return ok(undefined)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}
