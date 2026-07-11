export type Currency = import("./schemas").Currency
export type ExpenseCategory = import("./schemas").ExpenseCategory
export type ExpenseSortOrder = import("./schemas").ExpenseSortOrder

export type ExpenseMember = {
  id: string
  name: string
  initials: string
}

export type ExpenseSplit = {
  memberId: string
  memberName: string
  share: number
}

export type Expense = {
  id: string
  tripId: string
  description: string
  amount: number
  currency: Currency
  date: string
  category: ExpenseCategory
  payer: ExpenseMember
  receiptUrl: string | null
  createdAt: string
  splits: ExpenseSplit[]
}

export type PaginatedExpenses = {
  items: Expense[]
  total: number
  page: number
  limit: number
  pageCount: number
}

export type ListExpensesFilters = {
  page?: number
  limit?: number
  search?: string
  categories?: ExpenseCategory[]
  memberIds?: string[]
  startDate?: string
  endDate?: string
  sort?: ExpenseSortOrder
}

export type CreateExpenseCommand = {
  description: string
  amount: string
  currency: Currency
  date: string
  category: ExpenseCategory
  payerId: string
  receiptUrl?: string
  splits: { memberId: string; share: string }[]
}

export type UpdateExpenseCommand = Partial<CreateExpenseCommand>
