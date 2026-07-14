"use client"

import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppPageHeader } from "@/components/app-page-header"
import { CreateTripDialog } from "@/features/trips/ui/create-trip-dialog"

type HomeEmptyStateProps = {
  userName: string
}

export function HomeEmptyState({ userName }: HomeEmptyStateProps) {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <>
      <AppPageHeader />
      <div className="bg-muted flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Olá, {userName}</CardTitle>
            <CardDescription>
              Você ainda não tem viagens. Crie a primeira para começar a
              registrar gastos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full cursor-pointer"
              onClick={() => setCreateOpen(true)}
            >
              Nova viagem
            </Button>
            <CreateTripDialog open={createOpen} onOpenChange={setCreateOpen} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
