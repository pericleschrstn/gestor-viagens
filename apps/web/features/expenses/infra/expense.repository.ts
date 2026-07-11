import { serverFetch } from "@/features/shared/infra/http-client"

import type {
  CreateExpenseCommand,
  ListExpensesFilters,
  UpdateExpenseCommand,
} from "@/features/expenses/domain/models"
import type { ExpenseRepository } from "@/features/expenses/domain/repository.interface"
import {
  apiExpenseSchema,
  apiPaginatedExpensesSchema,
  mapExpense,
  mapPaginatedExpenses,
} from "@/features/expenses/infra/mappers"
import {
  apiTripAccessSchema,
  mapTripAccess,
} from "@/features/shared/infra/access.mapper"

function buildQuery(filters: ListExpensesFilters): string {
  const params = new URLSearchParams()

  if (filters.page !== undefined) params.set("page", String(filters.page))
  if (filters.limit !== undefined) params.set("limit", String(filters.limit))
  if (filters.search) params.set("search", filters.search)
  filters.categories?.forEach((category) =>
    params.append("categories", category),
  )
  filters.memberIds?.forEach((memberId) => params.append("memberIds", memberId))
  if (filters.startDate) params.set("startDate", filters.startDate)
  if (filters.endDate) params.set("endDate", filters.endDate)
  if (filters.sort) params.set("sort", filters.sort)

  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

export class HttpExpenseRepository implements ExpenseRepository {
  async list(tripId: string, filters: ListExpensesFilters) {
    const raw = await serverFetch<unknown>(
      `/trips/${tripId}/expenses${buildQuery(filters)}`,
    )
    return mapPaginatedExpenses(apiPaginatedExpensesSchema.parse(raw))
  }

  async getById(expenseId: string) {
    const raw = await serverFetch<unknown>(`/expenses/${expenseId}`)
    return mapExpense(apiExpenseSchema.parse(raw))
  }

  async create(tripId: string, command: CreateExpenseCommand) {
    const raw = await serverFetch<unknown>(`/trips/${tripId}/expenses`, {
      method: "POST",
      body: JSON.stringify(command),
    })
    return mapExpense(apiExpenseSchema.parse(raw))
  }

  async update(expenseId: string, command: UpdateExpenseCommand) {
    const raw = await serverFetch<unknown>(`/expenses/${expenseId}`, {
      method: "PATCH",
      body: JSON.stringify(command),
    })
    return mapExpense(apiExpenseSchema.parse(raw))
  }

  async remove(expenseId: string) {
    await serverFetch<void>(`/expenses/${expenseId}`, { method: "DELETE" })
  }

  async getTripAccess(tripId: string) {
    const raw = await serverFetch<unknown>(`/trips/${tripId}/access`)
    return mapTripAccess(apiTripAccessSchema.parse(raw))
  }
}

export const expenseRepository = new HttpExpenseRepository()
