export type Currency = "BRL" | "ARS"

export type TripStatus = "planning" | "active" | "closed"

export type ExpenseCategory =
  | "comida"
  | "hospedagem"
  | "transporte"
  | "passeios"
  | "compras"
  | "outros"

export type PublicUser = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type AuthResponse = {
  accessToken: string
  user: PublicUser
}

export type Trip = {
  id: string
  name: string
  initials: string
  startDate: string
  endDate: string
  status: TripStatus
  baseCurrency: Currency
  totalBudget: string | null
  ownerId: string
  createdAt: string
}

export type TripMember = {
  id: string
  tripId: string
  name: string
  initials: string
  userId: string | null
}

export type ExpenseSplit = {
  id: string
  expenseId: string
  memberId: string
  share: string
  member?: TripMember
}

export type Expense = {
  id: string
  tripId: string
  description: string
  amount: string
  currency: Currency
  date: string
  category: ExpenseCategory
  payerId: string
  receiptUrl: string | null
  createdAt: string
  payer?: TripMember
  splits?: ExpenseSplit[]
}

export type PaginatedResult<T> = {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    pageCount: number
  }
}

export type ExpenseSortOrder =
  | "newest"
  | "oldest"
  | "amount_desc"
  | "amount_asc"

export type ListExpensesQuery = {
  page?: number
  limit?: number
  search?: string
  category?: ExpenseCategory
  memberId?: string
  startDate?: string
  endDate?: string
  sort?: ExpenseSortOrder
}

export type CategorySummary = {
  category: ExpenseCategory
  spent: number
  limit: number | null
  percentage: number | null
}

export type TripSummary = {
  currency: Currency
  totalSpent: number
  totalBudget: number | null
  remaining: number | null
  dailyAverage: number
  perPerson: number
  tripDays: number
  elapsedDays: number
  byCategory: CategorySummary[]
  byDay: Record<string, number>
  recent: Expense[]
}

export type CreateExpenseInput = {
  description: string
  amount: string
  currency: Currency
  date: string
  category: ExpenseCategory
  payerId: string
  receiptUrl?: string
  splits: { memberId: string; share: string }[]
}

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }
