export const expenseKeys = {
  all: ["expenses"] as const,
  list: (tripId: string, filters: Record<string, unknown>) =>
    [...expenseKeys.all, tripId, filters] as const,
}
