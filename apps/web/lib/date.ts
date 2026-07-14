/** Parse `yyyy-MM-dd` as local calendar date (avoids UTC timezone drift). */
export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number)
  return new Date(year!, month! - 1, day!)
}

/** Format a Date as `yyyy-MM-dd` in local time. */
export function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function todayIsoDate(): string {
  return toIsoDate(new Date())
}
