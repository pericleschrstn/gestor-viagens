import type { TripRole } from "@/features/shared/domain/capabilities"

export type MemberRole = TripRole | null

export type Member = {
  id: string
  name: string
  initials: string
  userId: string | null
  role: MemberRole
}

export type CreateMemberCommand = {
  name: string
  initials: string
  userId?: string
  role?: TripRole
}

export type UpdateMemberCommand = Partial<CreateMemberCommand>
