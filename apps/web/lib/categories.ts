import {
  Bus,
  Camera,
  ShoppingBag,
  Utensils,
  BedDouble,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react"

import type { ExpenseCategory } from "@/features/expenses/domain/schemas"

export const CATEGORY_CONFIG: Record<
  ExpenseCategory,
  { icon: LucideIcon; color: string }
> = {
  comida: { icon: Utensils, color: "bg-orange-100 text-orange-700" },
  hospedagem: { icon: BedDouble, color: "bg-blue-100 text-blue-700" },
  transporte: { icon: Bus, color: "bg-green-100 text-green-700" },
  passeios: { icon: Camera, color: "bg-purple-100 text-purple-700" },
  compras: { icon: ShoppingBag, color: "bg-pink-100 text-pink-700" },
  outros: { icon: MoreHorizontal, color: "bg-muted text-muted-foreground" },
}

export const CATEGORY_CHART_COLORS: Record<ExpenseCategory, string> = {
  comida: "oklch(0.75 0.15 55)",
  hospedagem: "oklch(0.65 0.15 250)",
  transporte: "oklch(0.70 0.15 145)",
  passeios: "oklch(0.65 0.18 300)",
  compras: "oklch(0.72 0.15 350)",
  outros: "oklch(0.75 0.01 325)",
}

export const ALL_CATEGORIES: ExpenseCategory[] = [
  "comida",
  "hospedagem",
  "transporte",
  "passeios",
  "compras",
  "outros",
]
