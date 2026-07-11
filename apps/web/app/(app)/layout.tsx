import { redirect } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { QueryProvider } from "@/components/query-provider"
import { authService } from "@/features/auth/application/auth.service"
import { isUnauthorized } from "@/features/shared/domain/errors"
import { tripsService } from "@/features/trips/application/trips.service"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await authService.getSession()
  if (!user) {
    redirect("/login")
  }

  let trips
  try {
    trips = await tripsService.listTrips()
  } catch (error) {
    if (isUnauthorized(error)) {
      redirect("/login")
    }
    throw error
  }

  return (
    <QueryProvider>
      <AppShell user={user} trips={trips}>
        {children}
      </AppShell>
    </QueryProvider>
  )
}
