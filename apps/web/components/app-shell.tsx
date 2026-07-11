"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import type { AuthUser } from "@/features/auth/domain/models"
import type { Trip, TripSummary } from "@/features/trips/domain/models"

import { AppSidebar } from "./app-sidebar"

type TripSidebarState = {
  tripId: string
  summary: TripSummary
} | null

type AppShellContextValue = {
  user: AuthUser
  trips: Trip[]
  tripSidebar: TripSidebarState
  setTripSidebar: Dispatch<SetStateAction<TripSidebarState>>
}

const AppShellContext = createContext<AppShellContextValue | null>(null)

export function useAppShell() {
  const context = useContext(AppShellContext)
  if (!context) {
    throw new Error("useAppShell must be used within AppShell")
  }
  return context
}

export function useOptionalAppShell() {
  return useContext(AppShellContext)
}

type AppShellProps = {
  user: AuthUser
  trips: Trip[]
  children: ReactNode
}

export function AppShell({ user, trips, children }: AppShellProps) {
  const [tripSidebar, setTripSidebar] = useState<TripSidebarState>(null)

  const value = useMemo(
    () => ({
      user,
      trips,
      tripSidebar,
      setTripSidebar,
    }),
    [user, trips, tripSidebar],
  )

  return (
    <AppShellContext value={value}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex min-h-svh min-w-0 flex-col">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AppShellContext>
  )
}

export function TripSidebarBridge({
  tripId,
  summary,
}: {
  tripId: string
  summary: TripSummary
}) {
  const { setTripSidebar } = useAppShell()

  useEffect(() => {
    setTripSidebar({ tripId, summary })
    return () => setTripSidebar(null)
  }, [tripId, summary, setTripSidebar])

  return null
}
