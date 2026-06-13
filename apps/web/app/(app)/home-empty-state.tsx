"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AppPageHeader } from "@/components/app-page-header"

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
              Você ainda não tem viagens. Crie uma viagem pela API ou adicione
              dados de seed para começar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled className="w-full">
              Nova viagem (em breve)
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
