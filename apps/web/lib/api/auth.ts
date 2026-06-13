import { cache } from "react"

import { serverFetch } from "@/lib/api/server"
import { getAccessToken } from "@/lib/api/token"
import type { PublicUser } from "@/lib/api/types"

export const getSession = cache(async (): Promise<PublicUser | null> => {
  const token = await getAccessToken()
  if (!token) return null

  try {
    return await serverFetch<PublicUser>("/auth/me", { token })
  } catch {
    return null
  }
})
