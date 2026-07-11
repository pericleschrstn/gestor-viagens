import { notFound, redirect } from "next/navigation"
import { expensesService } from "@/features/expenses/application/expenses.service"
import { isNotFound, isUnauthorized } from "@/features/shared/domain/errors"
import { TripExpensesPageClient } from "./expenses-page-client"

type TripExpensesPageProps = {
  params: Promise<{ tripId: string }>
}

export default async function TripExpensesPage({
  params,
}: TripExpensesPageProps) {
  const { tripId } = await params

  let capabilities: Awaited<ReturnType<typeof expensesService.getTripAccess>>
  try {
    capabilities = await expensesService.getTripAccess(tripId)

    if (!capabilities.canRead) {
      notFound()
    }
  } catch (error) {
    if (isUnauthorized(error)) {
      redirect("/login")
    }
    if (isNotFound(error)) {
      notFound()
    }
    throw error
  }

  return <TripExpensesPageClient capabilities={capabilities} />
}
