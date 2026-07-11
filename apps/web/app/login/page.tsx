import { redirect } from "next/navigation"

import { LoginPageClient } from "@/app/login/page-client"
import { authService } from "@/features/auth/application/auth.service"

export default async function LoginPage() {
  const user = await authService.getSession()
  if (user) {
    redirect("/")
  }

  return <LoginPageClient />
}
