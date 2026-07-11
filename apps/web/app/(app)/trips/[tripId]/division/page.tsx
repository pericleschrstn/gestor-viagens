import { notFound, redirect } from "next/navigation"

import { settlementsService } from "@/features/settlements/application/settlements.service"
import { isNotFound, isUnauthorized } from "@/features/shared/domain/errors"

import { DivisionPageClient } from "./division-page-client"

type TripDivisionPageProps = {
  params: Promise<{ tripId: string }>
}

async function loadDivision(tripId: string) {
  const capabilities = await settlementsService.getTripAccess(tripId)

  if (!capabilities.canRead) {
    notFound()
  }

  const [balances, settlements] = await Promise.all([
    settlementsService.getBalances(tripId),
    settlementsService.getSuggestedSettlements(tripId),
  ])
  return { capabilities, balances, settlements }
}

export default async function TripDivisionPage({
  params,
}: TripDivisionPageProps) {
  const { tripId } = await params

  let data: Awaited<ReturnType<typeof loadDivision>>
  try {
    data = await loadDivision(tripId)
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
    <DivisionPageClient
      capabilities={data.capabilities}
      initialBalances={data.balances}
      initialSettlements={data.settlements}
    />
  )
}
