"use server"

import { expensesService } from "@/features/expenses/application/expenses.service"
import type {
  CreateExpenseCommand,
  Expense,
  ListExpensesFilters,
  PaginatedExpenses,
  UpdateExpenseCommand,
} from "@/features/expenses/domain/models"
import { listExpensesFiltersSchema } from "@/features/expenses/infra/mappers"
import { mapApiErrorToDomain } from "@/features/shared/domain/errors"
import type { Result } from "@/features/shared/domain/result"
import { ok } from "@/features/shared/domain/result"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

export async function listExpensesAction(
  tripId: string,
  filters: ListExpensesFilters = {},
): Promise<Result<PaginatedExpenses>> {
  try {
    const parsed = listExpensesFiltersSchema.parse(filters)
    const data = await expensesService.listExpenses(tripId, parsed)
    return ok(data)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}

export async function createExpenseAction(
  tripId: string,
  command: CreateExpenseCommand,
  capabilities: TripCapabilities,
): Promise<Result<Expense>> {
  try {
    const data = await expensesService.createExpense(tripId, command, capabilities)
    return ok(data)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}

export async function updateExpenseAction(
  expenseId: string,
  command: UpdateExpenseCommand,
  capabilities: TripCapabilities,
): Promise<Result<Expense>> {
  try {
    const data = await expensesService.updateExpense(expenseId, command, capabilities)
    return ok(data)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}

export async function deleteExpenseAction(
  expenseId: string,
  capabilities: TripCapabilities,
): Promise<Result<void>> {
  try {
    await expensesService.deleteExpense(expenseId, capabilities)
    return ok(undefined)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}

export async function getTripAccessAction(
  tripId: string,
): Promise<Result<TripCapabilities>> {
  try {
    const data = await expensesService.getTripAccess(tripId)
    return ok(data)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}
