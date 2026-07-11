"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Check, ChevronDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { formatTripDates, tripStatusLabel } from "@/lib/format"
import type { Trip } from "@/features/trips/domain/models"
import { tripHref } from "@/lib/trip-routes"

type TripSwitcherProps = {
  trip: Trip
  trips: Trip[]
}

export function TripSwitcher({ trip, trips }: TripSwitcherProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                tooltip={trip.name}
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="bg-primary text-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg text-[13px] font-semibold">
              {trip.initials}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold">{trip.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {tripStatusLabel(trip.status)} ·{" "}
                {formatTripDates(trip.startDate, trip.endDate)}
              </span>
            </div>
            <ChevronDown className="text-muted-foreground ml-auto group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[236px]" align="start">
            {trips.map((item) => (
              <TripSwitcherMenuItem key={item.id} item={item} currentId={trip.id} />
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem disabled className="gap-2">
              <Plus />
              Nova viagem (em breve)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function TripSwitcherMenuItem({
  item,
  currentId,
}: {
  item: Trip
  currentId: string
}) {
  const pathname = usePathname()

  return (
    <DropdownMenuItem
      render={
        <Link
          href={tripHref(item.id, pathname)}
          className="flex items-center gap-2.5"
        />
      }
    >
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold",
          item.id === currentId
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {item.initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.name}</p>
        <p className="text-muted-foreground truncate text-xs">
          {tripStatusLabel(item.status)}
        </p>
      </div>
      {item.id === currentId ? (
        <Check className="text-primary shrink-0" />
      ) : null}
    </DropdownMenuItem>
  )
}

type TripSwitcherFooterProps = {
  currentTripId: string
  trips: Trip[]
}

export function TripSwitcherFooter({
  currentTripId,
  trips,
}: TripSwitcherFooterProps) {
  const pathname = usePathname()
  const otherTrips = trips
    .filter((item) => item.id !== currentTripId)
    .slice(0, 3)

  if (otherTrips.length === 0) return null

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Outras viagens</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {otherTrips.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                render={
                  <Link href={tripHref(item.id, pathname)} />
                }
              >
                <div className="bg-muted flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold">
                  {item.initials}
                </div>
                <span className="truncate">{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
