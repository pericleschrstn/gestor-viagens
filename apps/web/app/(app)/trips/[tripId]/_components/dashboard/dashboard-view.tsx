"use client"

import { KpiGrid } from "./kpi-grid"
import { CategoryDonut } from "./category-donut"
import { SpendingBars } from "./spending-bars"
import { RecentExpenses } from "./recent-expenses"
import { DashboardHeader } from "../trip-app-bar"

export function DashboardView() {
  return (
    <div>
      <DashboardHeader />
      <div className="flex flex-col gap-4">
        <KpiGrid />
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <CategoryDonut />
          <SpendingBars />
        </div>
        <RecentExpenses />
      </div>
    </div>
  )
}
