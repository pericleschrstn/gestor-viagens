import type {
  CreateMemberCommand,
  Member,
  UpdateMemberCommand,
} from "@/features/members/domain/models"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

export interface MemberRepository {
  list(tripId: string): Promise<Member[]>
  create(tripId: string, command: CreateMemberCommand): Promise<Member>
  update(memberId: string, command: UpdateMemberCommand): Promise<Member>
  delete(memberId: string): Promise<void>
  getTripAccess(tripId: string): Promise<TripCapabilities>
}
