export type TripView = "dashboard" | "expenses" | "budget" | "division" | "settings"

const TRIP_VIEW_SEGMENTS: TripView[] = [
  "dashboard",
  "expenses",
  "budget",
  "division",
  "settings",
]

export function getTripIdFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/trips\/([^/]+)/)
  return match?.[1] ?? null
}

export function getTripViewFromPathname(pathname: string): TripView | null {
  const match = pathname.match(/^\/trips\/[^/]+\/([^/]+)/)
  const segment = match?.[1]
  if (!segment) return null
  return TRIP_VIEW_SEGMENTS.includes(segment as TripView)
    ? (segment as TripView)
    : null
}

export function tripViewHref(tripId: string, view: TripView): string {
  return `/trips/${tripId}/${view}`
}

export function tripHref(
  tripId: string,
  pathname: string,
  fallbackView: TripView = "dashboard",
): string {
  const view = getTripViewFromPathname(pathname) ?? fallbackView
  return tripViewHref(tripId, view)
}

export const TRIP_VIEW_LABELS: Record<TripView, string> = {
  dashboard: "Dashboard",
  expenses: "Gastos",
  budget: "Orçamento",
  division: "Divisão",
  settings: "Configurações",
}
