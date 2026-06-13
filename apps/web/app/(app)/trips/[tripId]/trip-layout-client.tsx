"use client"

import type { ReactNode } from "react"

import { TripSidebarBridge } from "@/components/app-shell"
import type {
  PublicUser,
  Trip,
  TripMember,
  TripSummary,
} from "@/lib/api/types"

import { ExpenseFormDialog } from "./_components/expense-form-dialog"
import { TripApp } from "./_components/trip-app"
import { TripAppBar } from "./_components/trip-app-bar"

type TripLayoutClientProps = {
  trip: Trip
  trips: Trip[]
  summary: TripSummary
  members: TripMember[]
  user: PublicUser
  children: ReactNode
}

export function TripLayoutClient({
  trip,
  trips,
  summary,
  members,
  user,
  children,
}: TripLayoutClientProps) {
  return (
    <TripApp.Provider
      trip={trip}
      trips={trips}
      summary={summary}
      members={members}
      user={user}
    >
      <TripSidebarBridge tripId={trip.id} summary={summary} />
      <TripAppBar />
      <TripApp.Content>{children}</TripApp.Content>
      <ExpenseFormDialog />
    </TripApp.Provider>
  )
}
