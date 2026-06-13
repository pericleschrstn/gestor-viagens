import { redirect } from "next/navigation"

import { LoginPageClient } from "@/app/login/page-client"
import { getSession } from "@/lib/api/auth"

export default async function LoginPage() {
  const user = await getSession()
  if (user) {
    redirect("/")
  }

  return <LoginPageClient />
}
