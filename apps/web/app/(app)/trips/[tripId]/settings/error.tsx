"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h2 className="text-lg font-semibold">Erro ao carregar configurações</h2>
      <p className="text-muted-foreground max-w-md text-sm">{error.message}</p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  )
}
