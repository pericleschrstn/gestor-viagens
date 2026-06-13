"use client"

import { AuthForm } from "./_components/auth-form"

export function LoginPageClient() {
  return (
    <div className="bg-muted flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="bg-primary text-primary-foreground mx-auto mb-4 flex size-10 items-center justify-center rounded-lg text-sm font-semibold">
            T
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Trilho</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gastos da viagem, organizados
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
