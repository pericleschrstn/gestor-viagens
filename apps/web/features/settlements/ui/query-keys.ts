export const settlementKeys = {
  all: ["settlements"] as const,
  trip: (tripId: string) => [...settlementKeys.all, tripId] as const,
  balances: (tripId: string) =>
    [...settlementKeys.trip(tripId), "balances"] as const,
  suggested: (tripId: string) =>
    [...settlementKeys.trip(tripId), "suggested"] as const,
}
