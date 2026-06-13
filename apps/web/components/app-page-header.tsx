"use client"

import type { ReactNode } from "react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type AppPageHeaderProps = {
  children?: ReactNode
  className?: string
}

export function AppPageHeader({ children, className }: AppPageHeaderProps) {
  return (
    <header
      className={cn(
        "border-border flex shrink-0 items-center gap-3 border-b px-5 py-3.5 lg:px-6",
        className,
      )}
    >
      <SidebarTrigger className="-ml-1" />
      {children}
    </header>
  )
}
