"use server"

import { membersService } from "@/features/members/application/members.service"
import type {
  CreateMemberCommand,
  Member,
  UpdateMemberCommand,
} from "@/features/members/domain/models"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"
import { mapApiErrorToDomain } from "@/features/shared/domain/errors"
import type { Result } from "@/features/shared/domain/result"
import { ok } from "@/features/shared/domain/result"

export async function listMembersAction(
  tripId: string,
): Promise<Result<Member[]>> {
  try {
    const data = await membersService.listMembers(tripId)
    return ok(data)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}

export async function createMemberAction(
  tripId: string,
  command: CreateMemberCommand,
  capabilities: TripCapabilities,
): Promise<Result<Member>> {
  try {
    const data = await membersService.createMember(tripId, command, capabilities)
    return ok(data)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}

export async function updateMemberAction(
  memberId: string,
  command: UpdateMemberCommand,
  capabilities: TripCapabilities,
): Promise<Result<Member>> {
  try {
    const data = await membersService.updateMember(memberId, command, capabilities)
    return ok(data)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}

export async function deleteMemberAction(
  memberId: string,
  capabilities: TripCapabilities,
): Promise<Result<void>> {
  try {
    await membersService.deleteMember(memberId, capabilities)
    return ok(undefined)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}
