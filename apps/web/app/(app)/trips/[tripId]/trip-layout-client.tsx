"use client"

import type { ReactNode } from "react"

import { TripSidebarBridge } from "@/components/app-shell"
import type { AuthUser } from "@/features/auth/domain/models"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"
import type { Trip, TripMember, TripSummary } from "@/features/trips/domain/models"

import { ExpenseFormDialog } from "./_components/expense-form-dialog"
import { TripApp } from "./_components/trip-app"
import { TripAppBar } from "./_components/trip-app-bar"

type TripLayoutClientProps = {
  trip: Trip
  trips: Trip[]
  summary: TripSummary
  members: TripMember[]
  user: AuthUser
  capabilities: TripCapabilities
  children: ReactNode
}

export function TripLayoutClient({
  trip,
  trips,
  summary,
  members,
  user,
  capabilities,
  children,
}: TripLayoutClientProps) {
  return (
    <TripApp.Provider
      trip={trip}
      trips={trips}
      summary={summary}
      members={members}
      user={user}
      capabilities={capabilities}
    >
      <TripSidebarBridge tripId={trip.id} summary={summary} />
      <TripAppBar />
      <TripApp.Content>{children}</TripApp.Content>
      {capabilities.canWrite ? <ExpenseFormDialog /> : null}
    </TripApp.Provider>
  )
}
