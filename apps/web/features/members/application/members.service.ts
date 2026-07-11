import type {
  CreateMemberCommand,
  UpdateMemberCommand,
} from "@/features/members/domain/models"
import type { MemberRepository } from "@/features/members/domain/repository.interface"
import { memberRepository } from "@/features/members/infra/members.repository"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

export class MembersService {
  constructor(
    private readonly repository: MemberRepository = memberRepository,
  ) {}

  listMembers(tripId: string) {
    return this.repository.list(tripId)
  }

  createMember(
    tripId: string,
    command: CreateMemberCommand,
    capabilities: TripCapabilities,
  ) {
    if (!capabilities.canManageMembers) {
      throw new Error("Sem permissão para gerenciar integrantes.")
    }
    return this.repository.create(tripId, command)
  }

  updateMember(
    memberId: string,
    command: UpdateMemberCommand,
    capabilities: TripCapabilities,
  ) {
    if (!capabilities.canManageMembers) {
      throw new Error("Sem permissão para gerenciar integrantes.")
    }
    return this.repository.update(memberId, command)
  }

  deleteMember(memberId: string, capabilities: TripCapabilities) {
    if (!capabilities.canManageMembers) {
      throw new Error("Sem permissão para gerenciar integrantes.")
    }
    return this.repository.delete(memberId)
  }

  getTripAccess(tripId: string) {
    return this.repository.getTripAccess(tripId)
  }
}

export const membersService = new MembersService()
