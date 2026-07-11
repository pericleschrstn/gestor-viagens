import { z } from "zod"

import {
  currencySchema,
  expenseCategorySchema,
} from "@/features/expenses/domain/schemas"
import { tripStatusSchema } from "@/features/trips/domain/schemas"

const numeric = z.union([z.string(), z.number()])

export const apiTripSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  initials: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  status: tripStatusSchema,
  baseCurrency: currencySchema,
  totalBudget: numeric.nullable(),
  ownerId: z.string().uuid(),
  createdAt: z.string(),
})

export const apiTripMemberSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  initials: z.string(),
})

const apiCategorySummarySchema = z.object({
  category: expenseCategorySchema,
  spent: z.number(),
  limit: z.number().nullable(),
  percentage: z.number().nullable(),
})

const apiRecentExpenseSchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
  amount: numeric,
  currency: currencySchema,
  date: z.string(),
  category: expenseCategorySchema,
  payerId: z.string().uuid(),
  payer: apiTripMemberSchema.optional(),
})

export const apiTripSummarySchema = z.object({
  currency: currencySchema,
  totalSpent: z.number(),
  totalBudget: z.number().nullable(),
  remaining: z.number().nullable(),
  dailyAverage: z.number(),
  perPerson: z.number(),
  tripDays: z.number(),
  elapsedDays: z.number(),
  byCategory: z.array(apiCategorySummarySchema),
  byDay: z.record(z.string(), z.number()),
  recent: z.array(apiRecentExpenseSchema),
})

export function mapTrip(dto: z.infer<typeof apiTripSchema>) {
  return {
    id: dto.id,
    name: dto.name,
    initials: dto.initials,
    startDate: dto.startDate,
    endDate: dto.endDate,
    status: dto.status,
    baseCurrency: dto.baseCurrency,
    totalBudget: dto.totalBudget === null ? null : Number(dto.totalBudget),
    ownerId: dto.ownerId,
    createdAt: dto.createdAt,
  }
}

export function mapTripMember(dto: z.infer<typeof apiTripMemberSchema>) {
  return {
    id: dto.id,
    name: dto.name,
    initials: dto.initials,
  }
}

export function mapTripSummary(dto: z.infer<typeof apiTripSummarySchema>) {
  return {
    currency: dto.currency,
    totalSpent: dto.totalSpent,
    totalBudget: dto.totalBudget,
    remaining: dto.remaining,
    dailyAverage: dto.dailyAverage,
    perPerson: dto.perPerson,
    tripDays: dto.tripDays,
    elapsedDays: dto.elapsedDays,
    byCategory: dto.byCategory.map((item) => ({
      category: item.category,
      spent: item.spent,
      limit: item.limit,
      percentage: item.percentage,
    })),
    byDay: dto.byDay,
    recent: dto.recent.map((item) => ({
      id: item.id,
      description: item.description,
      amount: String(item.amount),
      currency: item.currency,
      date: item.date,
      category: item.category,
      payerId: item.payerId,
      payer: item.payer
        ? {
            id: item.payer.id,
            name: item.payer.name,
            initials: item.payer.initials,
          }
        : undefined,
    })),
  }
}
