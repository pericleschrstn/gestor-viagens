import type {
  CreateExpenseCommand,
  Expense,
  ListExpensesFilters,
  PaginatedExpenses,
  UpdateExpenseCommand,
} from "@/features/expenses/domain/models"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

export interface ExpenseRepository {
  list(tripId: string, filters: ListExpensesFilters): Promise<PaginatedExpenses>
  getById(expenseId: string): Promise<Expense>
  create(tripId: string, command: CreateExpenseCommand): Promise<Expense>
  update(expenseId: string, command: UpdateExpenseCommand): Promise<Expense>
  remove(expenseId: string): Promise<void>
  getTripAccess(tripId: string): Promise<TripCapabilities>
}
