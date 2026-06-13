import { serverFetch } from "@/lib/api/server"
import type {
  CreateExpenseInput,
  Expense,
  ListExpensesQuery,
  PaginatedResult,
} from "@/lib/api/types"

function buildExpensesQuery(query: ListExpensesQuery = {}): string {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value))
    }
  }

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ""
}

export async function listExpenses(
  tripId: string,
  query: ListExpensesQuery = {},
): Promise<PaginatedResult<Expense>> {
  return serverFetch<PaginatedResult<Expense>>(
    `/trips/${tripId}/expenses${buildExpensesQuery(query)}`,
  )
}

export async function createExpense(
  tripId: string,
  input: CreateExpenseInput,
): Promise<Expense> {
  return serverFetch<Expense>(`/trips/${tripId}/expenses`, {
    method: "POST",
    body: JSON.stringify(input),
  })
}
