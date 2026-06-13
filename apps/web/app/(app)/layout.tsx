import { redirect } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { getSession } from "@/lib/api/auth"
import { isUnauthorized } from "@/lib/api/errors"
import { listTrips } from "@/lib/api/trips"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getSession()
  if (!user) {
    redirect("/login")
  }

  let trips
  try {
    trips = await listTrips()
  } catch (error) {
    if (isUnauthorized(error)) {
      redirect("/login")
    }
    throw error
  }

  return (
    <AppShell user={user} trips={trips}>
      {children}
    </AppShell>
  )
}
