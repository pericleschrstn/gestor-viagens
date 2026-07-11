import { z } from "zod"

import {
  currencySchema,
  expenseCategorySchema,
} from "@/features/expenses/domain/schemas"

const apiCategorySummarySchema = z.object({
  category: expenseCategorySchema,
  spent: z.union([z.string(), z.number()]),
  limit: z.union([z.string(), z.number()]).nullable(),
  percentage: z.union([z.string(), z.number()]).nullable(),
})

export const apiBudgetSummarySchema = z.object({
  currency: currencySchema,
  totalSpent: z.union([z.string(), z.number()]),
  totalBudget: z.union([z.string(), z.number()]).nullable(),
  remaining: z.union([z.string(), z.number()]).nullable(),
  tripDays: z.number(),
  elapsedDays: z.number(),
  byCategory: z.array(apiCategorySummarySchema),
})

const toNumber = (value: string | number | null) =>
  value === null ? null : Number(value)

export function mapBudgetSummary(dto: z.infer<typeof apiBudgetSummarySchema>) {
  return {
    currency: dto.currency,
    totalSpent: Number(dto.totalSpent),
    totalBudget: toNumber(dto.totalBudget),
    remaining: toNumber(dto.remaining),
    tripDays: dto.tripDays,
    elapsedDays: dto.elapsedDays,
    categories: dto.byCategory.map((item) => ({
      category: item.category,
      spent: Number(item.spent),
      limit: toNumber(item.limit),
      percentage: toNumber(item.percentage),
    })),
  }
}

export const updateBudgetCommandSchema = z.object({
  totalBudget: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Informe um valor válido.")
    .optional(),
  categories: z.array(
    z.object({
      category: expenseCategorySchema,
      limitAmount: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "Informe um valor válido."),
    }),
  ),
})
