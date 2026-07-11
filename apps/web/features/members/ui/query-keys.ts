export const memberKeys = {
  all: ["members"] as const,
  list: (tripId: string) => [...memberKeys.all, tripId] as const,
}
