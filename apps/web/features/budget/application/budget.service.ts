import type { UpdateBudgetCommand } from "@/features/budget/domain/models"
import type { BudgetRepository } from "@/features/budget/domain/repository.interface"
import { budgetRepository } from "@/features/budget/infra/budget.repository"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

export class BudgetService {
  constructor(
    private readonly repository: BudgetRepository = budgetRepository,
  ) {}

  getSummary(tripId: string) {
    return this.repository.getSummary(tripId)
  }

  updateBudget(
    tripId: string,
    command: UpdateBudgetCommand,
    capabilities: TripCapabilities,
  ) {
    if (!capabilities.canManageBudget) {
      throw new Error("Sem permissão para editar o orçamento.")
    }
    return this.repository.updateBudget(tripId, command)
  }

  getTripAccess(tripId: string) {
    return this.repository.getTripAccess(tripId)
  }
}

export const budgetService = new BudgetService()
