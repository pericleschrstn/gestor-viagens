import { z } from "zod"

import type {
  CreateMemberCommand,
  Member,
  UpdateMemberCommand,
} from "@/features/members/domain/models"
import { tripRoleSchema } from "@/features/shared/infra/access.mapper"

export const apiMemberSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  initials: z.string(),
  userId: z.string().uuid().nullable(),
  role: tripRoleSchema.nullable(),
})

export function mapMember(dto: z.infer<typeof apiMemberSchema>): Member {
  return {
    id: dto.id,
    name: dto.name,
    initials: dto.initials,
    userId: dto.userId,
    role: dto.role,
  }
}

export const createMemberCommandSchema = z.object({
  name: z.string().min(1),
  initials: z.string().min(1).max(4),
  userId: z.string().uuid().optional(),
  role: tripRoleSchema.optional(),
})

export const updateMemberCommandSchema = createMemberCommandSchema.partial()

export function toCreateMemberPayload(command: CreateMemberCommand) {
  return createMemberCommandSchema.parse(command)
}

export function toUpdateMemberPayload(command: UpdateMemberCommand) {
  return updateMemberCommandSchema.parse(command)
}
