import { z } from "zod"

export const currencySchema = z.enum(["BRL", "ARS"])
export const expenseCategorySchema = z.enum([
  "comida",
  "hospedagem",
  "transporte",
  "passeios",
  "compras",
  "outros",
])
export const expenseSortOrderSchema = z.enum([
  "newest",
  "oldest",
  "amount_desc",
  "amount_asc",
])

export type Currency = z.infer<typeof currencySchema>
export type ExpenseCategory = z.infer<typeof expenseCategorySchema>
export type ExpenseSortOrder = z.infer<typeof expenseSortOrderSchema>
