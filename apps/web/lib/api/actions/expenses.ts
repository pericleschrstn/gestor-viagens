"use server"

import { createExpense } from "@/lib/api/expenses"
import { ApiError } from "@/lib/api/errors"
import type { ActionResult, CreateExpenseInput, Expense } from "@/lib/api/types"

export async function createExpenseAction(
  tripId: string,
  input: CreateExpenseInput,
): Promise<ActionResult<Expense>> {
  try {
    const expense = await createExpense(tripId, input)
    return { success: true, data: expense }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Não foi possível salvar o gasto." }
  }
}
