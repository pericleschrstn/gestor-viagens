"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AppPageHeader } from "@/components/app-page-header"
import { CreateTripDialog } from "@/features/trips/ui/create-trip-dialog"

type HomeEmptyStateProps = {
  userName: string
}

export function HomeEmptyState({ userName }: HomeEmptyStateProps) {
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
            <CreateTripDialog
              trigger={
                <button
                  type="button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 w-full items-center justify-center rounded-md px-4 text-sm font-medium"
                >
                  Nova viagem
                </button>
              }
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
