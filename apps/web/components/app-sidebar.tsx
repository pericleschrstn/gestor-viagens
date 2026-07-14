"use client"

import { ChevronDown, LogOut, User } from "lucide-react"
import { usePathname } from "next/navigation"

import { useAppShell } from "@/components/app-shell"
import { ThemeMenuItems } from "@/components/theme-menu-items"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { logoutAction } from "@/features/auth/actions/auth.actions"
import { getTripIdFromPathname } from "@/lib/trip-routes"

import { TripNav } from "@/app/(app)/trips/[tripId]/_components/trip-nav"
import {
  TripSwitcher,
  TripSwitcherFooter,
} from "@/app/(app)/trips/[tripId]/_components/trip-switcher"

export function AppSidebar() {
  const pathname = usePathname()
  const { user, trips } = useAppShell()
  const tripId = getTripIdFromPathname(pathname)
  const currentTrip = tripId
    ? trips.find((trip) => trip.id === tripId)
    : undefined

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Sidebar collapsible="icon">
      {currentTrip ? (
        <SidebarHeader>
          <TripSwitcher trip={currentTrip} trips={trips} />
        </SidebarHeader>
      ) : null}

      <SidebarContent>
        {tripId ? <TripNav tripId={tripId} /> : null}
        {currentTrip ? (
          <TripSwitcherFooter currentTripId={currentTrip.id} trips={trips} />
        ) : null}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    tooltip={user.name}
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  />
                }
              >
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                <ChevronDown className="ml-auto text-muted-foreground group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>

              <DropdownMenuContent side="top" align="start" sideOffset={4}>
                <DropdownMenuItem disabled className="gap-2">
                  <User />
                  Minha conta
                </DropdownMenuItem>

                <ThemeMenuItems />

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer gap-2"
                  onClick={() => logoutAction()}
                >
                  <LogOut />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
