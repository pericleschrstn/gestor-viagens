import type { Currency, ExpenseCategory } from "@/features/expenses/domain/models"

import type { TripStatus } from "./schemas"

export type Trip = {
  id: string
  name: string
  initials: string
  startDate: string
  endDate: string
  status: TripStatus
  baseCurrency: Currency
  totalBudget: number | null
  ownerId: string
  createdAt: string
}

export type TripMember = {
  id: string
  name: string
  initials: string
}

export type TripCategorySummary = {
  category: ExpenseCategory
  spent: number
  limit: number | null
  percentage: number | null
}

export type TripRecentExpense = {
  id: string
  description: string
  amount: string
  currency: Currency
  date: string
  category: ExpenseCategory
  payerId: string
  payer?: { id: string; name: string; initials: string }
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
  byCategory: TripCategorySummary[]
  byDay: Record<string, number>
  recent: TripRecentExpense[]
}
