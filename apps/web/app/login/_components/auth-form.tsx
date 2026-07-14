"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  loginAction,
  registerAction,
} from "@/features/auth/actions/auth.actions"

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")
    const name = String(formData.get("name") ?? "")

    startTransition(async () => {
      const result =
        mode === "login"
          ? await loginAction({ email, password })
          : await registerAction({ name, email, password })

      if (!result.ok) {
        setError(result.error.message)
        return
      }

      router.push("/")
      router.refresh()
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "login" ? "Entrar" : "Criar conta"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Use seu e-mail e senha para acessar."
            : "Preencha os dados para começar."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "register" ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                required
                minLength={2}
                autoComplete="name"
                placeholder="Ana Ribeiro"
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="ana@email.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
          </div>

          {error ? (
            <p className="text-destructive text-sm">{error}</p>
          ) : null}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending
              ? "Aguarde..."
              : mode === "login"
                ? "Entrar"
                : "Criar conta"}
            {isPending ? <Spinner data-icon="inline-end" /> : null}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          {mode === "login" ? (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => {
                setMode("register")
                setError(null)
              }}
            >
              Não tem conta?{" "}
              <span className="text-primary font-medium">Criar conta</span>
            </button>
          ) : (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => {
                setMode("login")
                setError(null)
              }}
            >
              Já tem conta?{" "}
              <span className="text-primary font-medium">Entrar</span>
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
