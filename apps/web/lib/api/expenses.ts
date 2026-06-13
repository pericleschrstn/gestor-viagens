import { serverFetch } from "@/lib/api/server"
import type { CreateExpenseInput, Expense } from "@/lib/api/types"

export async function createExpense(
  tripId: string,
  input: CreateExpenseInput,
): Promise<Expense> {
  return serverFetch<Expense>(`/trips/${tripId}/expenses`, {
    method: "POST",
    body: JSON.stringify(input),
  })
}
