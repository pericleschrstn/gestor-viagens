import { z } from "zod"

import {
  currencySchema,
  expenseCategorySchema,
  expenseSortOrderSchema,
} from "@/features/expenses/domain/schemas"
import { mapTripAccess } from "@/features/shared/infra/access.mapper"

const apiMemberSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  initials: z.string(),
})

const apiSplitSchema = z.object({
  id: z.string().uuid(),
  expenseId: z.string().uuid(),
  memberId: z.string().uuid(),
  share: z.union([z.string(), z.number()]),
  member: apiMemberSchema.optional(),
})

export const apiExpenseSchema = z.object({
  id: z.string().uuid(),
  tripId: z.string().uuid(),
  description: z.string(),
  amount: z.union([z.string(), z.number()]),
  currency: currencySchema,
  date: z.string(),
  category: expenseCategorySchema,
  payerId: z.string().uuid(),
  receiptUrl: z.string().nullable(),
  createdAt: z.string(),
  payer: apiMemberSchema.optional(),
  splits: z.array(apiSplitSchema).optional(),
})

export const apiPaginatedExpensesSchema = z.object({
  data: z.array(apiExpenseSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pageCount: z.number(),
  }),
})

export { mapTripAccess }

export function mapExpense(dto: z.infer<typeof apiExpenseSchema>) {
  const payer = dto.payer ?? { id: dto.payerId, name: "—", initials: "?" }

  return {
    id: dto.id,
    tripId: dto.tripId,
    description: dto.description,
    amount: Number(dto.amount),
    currency: dto.currency,
    date: dto.date,
    category: dto.category,
    payer: {
      id: payer.id,
      name: payer.name,
      initials: payer.initials,
    },
    receiptUrl: dto.receiptUrl,
    createdAt: dto.createdAt,
    splits: (dto.splits ?? []).map((split) => ({
      memberId: split.memberId,
      memberName: split.member?.name ?? "—",
      share: Number(split.share),
    })),
  }
}

export function mapPaginatedExpenses(
  dto: z.infer<typeof apiPaginatedExpensesSchema>,
) {
  return {
    items: dto.data.map(mapExpense),
    total: dto.meta.total,
    page: dto.meta.page,
    limit: dto.meta.limit,
    pageCount: dto.meta.pageCount,
  }
}

export const listExpensesFiltersSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  search: z.string().optional(),
  categories: z.array(expenseCategorySchema).optional(),
  memberIds: z.array(z.string().uuid()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sort: expenseSortOrderSchema.optional(),
})
