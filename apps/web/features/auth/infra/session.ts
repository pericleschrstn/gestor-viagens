import { cookies } from "next/headers"

import { ACCESS_TOKEN_COOKIE } from "@/features/shared/infra/config"

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export async function setAccessToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  })
}

export async function clearAccessToken() {
  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_TOKEN_COOKIE)
}
