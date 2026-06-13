import { cookies } from "next/headers"

import { ACCESS_TOKEN_COOKIE } from "@/lib/api/config"

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value
}
