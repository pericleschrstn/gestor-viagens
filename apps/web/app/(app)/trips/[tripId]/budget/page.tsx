import { notFound, redirect } from "next/navigation"

import { budgetService } from "@/features/budget/application/budget.service"
import { isNotFound, isUnauthorized } from "@/features/shared/domain/errors"

import { BudgetPageClient } from "./budget-page-client"

type TripBudgetPageProps = {
  params: Promise<{ tripId: string }>
}

async function loadBudget(tripId: string) {
  const capabilities = await budgetService.getTripAccess(tripId)

  if (!capabilities.canRead) {
    notFound()
  }

  const summary = await budgetService.getSummary(tripId)
  return { capabilities, summary }
}

export default async function TripBudgetPage({ params }: TripBudgetPageProps) {
  const { tripId } = await params

  let data: Awaited<ReturnType<typeof loadBudget>>
  try {
    data = await loadBudget(tripId)
  } catch (error) {
    if (isUnauthorized(error)) {
      redirect("/login")
    }
    if (isNotFound(error)) {
      notFound()
    }
    throw error
  }

  return (
    <BudgetPageClient
      capabilities={data.capabilities}
      initialSummary={data.summary}
    />
  )
}
