import { cookies } from "next/headers"

import { ACCESS_TOKEN_COOKIE } from "@/features/shared/infra/config"

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value
}
