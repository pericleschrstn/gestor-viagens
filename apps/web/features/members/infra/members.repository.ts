import { z } from "zod"

import type {
  CreateMemberCommand,
  UpdateMemberCommand,
} from "@/features/members/domain/models"
import type { MemberRepository } from "@/features/members/domain/repository.interface"
import {
  apiMemberSchema,
  mapMember,
  toCreateMemberPayload,
  toUpdateMemberPayload,
} from "@/features/members/infra/mappers"
import {
  apiTripAccessSchema,
  mapTripAccess,
} from "@/features/shared/infra/access.mapper"
import { serverFetch } from "@/features/shared/infra/http-client"

export class HttpMemberRepository implements MemberRepository {
  async list(tripId: string) {
    const raw = await serverFetch<unknown>(`/trips/${tripId}/members`)
    return z.array(apiMemberSchema).parse(raw).map(mapMember)
  }

  async create(tripId: string, command: CreateMemberCommand) {
    const raw = await serverFetch<unknown>(`/trips/${tripId}/members`, {
      method: "POST",
      body: JSON.stringify(toCreateMemberPayload(command)),
    })
    return mapMember(apiMemberSchema.parse(raw))
  }

  async update(memberId: string, command: UpdateMemberCommand) {
    const raw = await serverFetch<unknown>(`/members/${memberId}`, {
      method: "PATCH",
      body: JSON.stringify(toUpdateMemberPayload(command)),
    })
    return mapMember(apiMemberSchema.parse(raw))
  }

  async delete(memberId: string) {
    await serverFetch<unknown>(`/members/${memberId}`, { method: "DELETE" })
  }

  async getTripAccess(tripId: string) {
    const raw = await serverFetch<unknown>(`/trips/${tripId}/access`)
    return mapTripAccess(apiTripAccessSchema.parse(raw))
  }
}

export const memberRepository = new HttpMemberRepository()
