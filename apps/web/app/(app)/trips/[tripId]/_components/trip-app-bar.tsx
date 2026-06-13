"use client"

import { usePathname } from "next/navigation"
import { ChevronRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppPageHeader } from "@/components/app-page-header"
import {
  getTripViewFromPathname,
  TRIP_VIEW_LABELS,
} from "@/lib/trip-routes"

import { useTripApp } from "./trip-app"

export function TripAppBar() {
  const pathname = usePathname()
  const activeView = getTripViewFromPathname(pathname) ?? "dashboard"
  const {
    actions: { openExpenseDialog },
  } = useTripApp()

  return (
    <AppPageHeader>
      <nav
        aria-label="Breadcrumb"
        className="text-muted-foreground flex min-w-0 flex-1 items-center gap-1.5 text-xs"
      >
        <span>Trilho</span>
        <ChevronRight className="size-3.5 shrink-0" aria-hidden />
        <span className="text-foreground font-medium">
          {TRIP_VIEW_LABELS[activeView]}
        </span>
      </nav>

      {activeView === "dashboard" ? (
        <Button onClick={openExpenseDialog}>
          <Plus data-icon="inline-start" />
          Adicionar gasto
        </Button>
      ) : null}
    </AppPageHeader>
  )
}

export function DashboardHeader() {
  const {
    state: { summary },
  } = useTripApp()

  return (
    <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-[22px] font-semibold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground text-[13.5px]">
          Dia {summary.elapsedDays} de {summary.tripDays} · acompanhe o
          orçamento em tempo real
        </p>
      </div>
    </div>
  )
}
