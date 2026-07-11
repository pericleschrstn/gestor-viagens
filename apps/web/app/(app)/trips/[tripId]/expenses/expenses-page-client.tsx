"use client"

import { ExpensesView } from "@/features/expenses/ui/expenses-view"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

import { useTripApp } from "../_components/trip-app"

type TripExpensesPageClientProps = {
  capabilities: TripCapabilities
}

export function TripExpensesPageClient({
  capabilities,
}: TripExpensesPageClientProps) {
  const {
    state: { trip, members },
  } = useTripApp()

  return (
    <ExpensesView
      tripId={trip.id}
      tripName={trip.name}
      members={members}
      capabilities={capabilities}
    />
  )
}
