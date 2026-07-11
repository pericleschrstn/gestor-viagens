import type {
  CreateExpenseCommand,
  ListExpensesFilters,
  UpdateExpenseCommand,
} from "@/features/expenses/domain/models"
import type { ExpenseRepository } from "@/features/expenses/domain/repository.interface"
import { expenseRepository } from "@/features/expenses/infra/expense.repository"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

export class ExpensesService {
  constructor(private readonly repository: ExpenseRepository = expenseRepository) {}

  listExpenses(tripId: string, filters: ListExpensesFilters = {}) {
    return this.repository.list(tripId, {
      page: filters.page ?? 1,
      limit: filters.limit ?? 20,
      sort: filters.sort ?? "newest",
      ...filters,
    })
  }

  getExpense(expenseId: string) {
    return this.repository.getById(expenseId)
  }

  createExpense(tripId: string, command: CreateExpenseCommand, capabilities: TripCapabilities) {
    if (!capabilities.canWrite) {
      throw new Error("Sem permissão para criar gastos.")
    }
    return this.repository.create(tripId, command)
  }

  updateExpense(
    expenseId: string,
    command: UpdateExpenseCommand,
    capabilities: TripCapabilities,
  ) {
    if (!capabilities.canWrite) {
      throw new Error("Sem permissão para editar gastos.")
    }
    return this.repository.update(expenseId, command)
  }

  deleteExpense(expenseId: string, capabilities: TripCapabilities) {
    if (!capabilities.canWrite) {
      throw new Error("Sem permissão para excluir gastos.")
    }
    return this.repository.remove(expenseId)
  }

  getTripAccess(tripId: string) {
    return this.repository.getTripAccess(tripId)
  }
}

export const expensesService = new ExpensesService()
