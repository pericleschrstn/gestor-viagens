export const budgetKeys = {
  all: ["budget"] as const,
  summary: (tripId: string) => [...budgetKeys.all, tripId] as const,
}
