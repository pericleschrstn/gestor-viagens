"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  List,
  PieChart,
  Settings,
  Users,
} from "lucide-react"

import { useAppShell } from "@/components/app-shell"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  getTripViewFromPathname,
  tripViewHref,
  type TripView,
} from "@/lib/trip-routes"

const NAV_ITEMS: {
  id: TripView
  label: string
  icon: typeof LayoutDashboard
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "expenses", label: "Gastos", icon: List },
  { id: "budget", label: "Orçamento", icon: PieChart },
  { id: "division", label: "Divisão", icon: Users },
  { id: "settings", label: "Configurações", icon: Settings },
]

type TripNavProps = {
  tripId: string
}

export function TripNav({ tripId }: TripNavProps) {
  const pathname = usePathname()
  const activeView = getTripViewFromPathname(pathname)
  const { tripSidebar } = useAppShell()
  const summary =
    tripSidebar?.tripId === tripId ? tripSidebar.summary : null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Viagem atual</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  render={<Link href={tripViewHref(tripId, item.id)} />}
                  isActive={isActive}
                  tooltip={item.label}
                >
                  <Icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
                {item.id === "expenses" &&
                summary &&
                summary.recent.length > 0 ? (
                  <SidebarMenuBadge>{summary.recent.length}</SidebarMenuBadge>
                ) : null}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
