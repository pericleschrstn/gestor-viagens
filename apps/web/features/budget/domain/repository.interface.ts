import type {
  BudgetSummary,
  UpdateBudgetCommand,
} from "@/features/budget/domain/models"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

export interface BudgetRepository {
  getSummary(tripId: string): Promise<BudgetSummary>
  updateBudget(
    tripId: string,
    command: UpdateBudgetCommand,
  ): Promise<BudgetSummary>
  getTripAccess(tripId: string): Promise<TripCapabilities>
}
