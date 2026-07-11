export type Currency = import("@/features/expenses/domain/schemas").Currency
export type ExpenseCategory =
  import("@/features/expenses/domain/schemas").ExpenseCategory

export type BudgetCategory = {
  category: ExpenseCategory
  spent: number
  limit: number | null
  percentage: number | null
}

export type BudgetSummary = {
  currency: Currency
  totalSpent: number
  totalBudget: number | null
  remaining: number | null
  tripDays: number
  elapsedDays: number
  categories: BudgetCategory[]
}

export type CategoryBudgetInput = {
  category: ExpenseCategory
  limitAmount: string
}

export type UpdateBudgetCommand = {
  totalBudget?: string
  categories: CategoryBudgetInput[]
}
