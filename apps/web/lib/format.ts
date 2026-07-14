import type { Currency, ExpenseCategory } from "@/features/expenses/domain/schemas"

export function formatMoney(value: number, currency: Currency): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value)
}

export function formatTripDates(start: string, end: string): string {
  const startDate = new Date(`${start}T12:00:00`)
  const endDate = new Date(`${end}T12:00:00`)
  const sameMonth = startDate.getMonth() === endDate.getMonth()
  const sameYear = startDate.getFullYear() === endDate.getFullYear()

  const dayFmt = new Intl.DateTimeFormat("pt-BR", { day: "numeric" })
  const monthFmt = new Intl.DateTimeFormat("pt-BR", { month: "short" })
  const yearFmt = new Intl.DateTimeFormat("pt-BR", { year: "numeric" })

  if (sameMonth && sameYear) {
    return `${dayFmt.format(startDate)}–${dayFmt.format(endDate)} ${monthFmt.format(endDate)} ${yearFmt.format(endDate)}`
  }

  return `${dayFmt.format(startDate)} ${monthFmt.format(startDate)} – ${dayFmt.format(endDate)} ${monthFmt.format(endDate)} ${yearFmt.format(endDate)}`
}

export function formatShortDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T12:00:00`))
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`))
}

export function categoryLabel(category: ExpenseCategory): string {
  const labels: Record<ExpenseCategory, string> = {
    comida: "Comida",
    hospedagem: "Hospedagem",
    transporte: "Transporte",
    passeios: "Passeios",
    compras: "Compras",
    outros: "Outros",
  }
  return labels[category]
}

export function tripStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    planning: "planejando",
    active: "em andamento",
    closed: "encerrada",
  }
  return labels[status] ?? status
}
